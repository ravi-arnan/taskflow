# TaskFlow Assesment Solutions

Dokumen ini berisi penjelasan ringkas mengenai solusi teknikal yang telah diimplementasikan untuk memperbaiki bug dan menambah fitur baru pada aplikasi TaskFlow berdasarkan _requirements_ yang diberikan.

## 1. Perbaikan Bug (Fixes)

### A. Critical Security Flag (SQL Injection)
**Masalah**: Endpoint `/api/tasks` menggunakan string concatenation secara langsung dari parameter query URL ke dalam statement SQL (`query = "SELECT * FROM tasks WHERE status = '" + status + "'"`). Praktik ini rentan terhadap serangan SQL Injection karena attacker dapat menyisipkan perintah SQL berbahaya.
**Solusi**:
- Mengubah kueri SQL menggunakan **Parameterized Queries** bawaan dari pustaka `pg` (contoh: `SELECT ... WHERE status = $1`). 
- Node.js pg engine otomatis mensanitasi input yang dimasukkan sebagai parameter terpisah, mencegah interupsi perintah SQL.

### B. Performance Degradation (N+1 Query Problem)
**Masalah**: Di dalam endpoint `/api/tasks`, terjadi pe-looping untuk mendapatkan informasi `userName` ke database per masing-masing tugas (`tasks`). Jika terdapat ribuan task, akan terjadi ribuan pemanggilan API ke database secara beruntun dalam satu kali _request_.
**Solusi**:
- Menggabungkan kueri menggunakan `LEFT JOIN users ON tasks.user_id = users.id`.
- Dengan cara ini, pengambilan data tabel tasks dan data user (pembuat tugas) dapat dieksekusi hanya dengan **satu kali kueri** ke database sehingga performa secara drastis meningkat.

### C. Poor UX (Broken Reactivity)
**Masalah**: Saat pengguna menekan tombol "Complete", fungsi `markCompleted` memutasi _state_ React secara langsung pada memori yang sama (`currentTasks.find(t => t.id === taskId).status = 'completed'; setTasks(currentTasks);`). Karena referensi array tidak berubah, Virtual DOM React gagal mendeteksi perubahan sehingga tidak memicu _re-render_ UI.
**Solusi**:
- Menggunakan prinsip _immutable state_ dalam React. 
- Memperbarui array menggunakan `.map()` yang menghasilkan *array* baru, lantas dimasukkan pada method _updater_ React (`setTasks`) agar UI di-*render* ulang.

---

## 2. Fitur Baru (Feature)

### Export to CSV
**Tujuan**: Menambahkan tombol "Download CSV" untuk mengekspor data task persis sesuai dengan yang dimuat oleh UI frontend.
**Implementasi**:
- **Backend (API)**: Membuat endpoint `GET /api/tasks/export` yang mendukung query payload berupa `status`. Menggunakan perulangan untuk menyusun file teks berbentuk CSV _(Comma Separated Values)_ menggunakan header yang sesuai, sembari memberikan *escape quotes* secara hati-hati agar elemen koma maupun *newline* dalam isi *task* tidak merusak *formatting* CSV. Diakhiri dengan melampirkan file respon dengan `Content-Disposition: attachment`.
- **Frontend (UI)**: Menambah fungsionalitas tombol UI (melalui tombol unduh), lalu menyematkan *loading screen* (*button disabling state*) untuk memberikan transisi mulus ke pengguna selama proses pengunduhan merender di belakang layar. Menyinkronkan fungsional parameter ke target status UI terkini, merekonstruksikan _Blob_, dan diakhiri dengan unduh file yang dinamis melalui API navigasi DOM Virtual.
