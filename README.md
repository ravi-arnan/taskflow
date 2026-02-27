# TaskFlow - Technical Assessment

Welcome to the TaskFlow technical assessment! This is a full-stack task management application built with React, Node.js/Express, and PostgreSQL.

## Project Overview

TaskFlow is a simple task management system that allows users to:
- View and filter tasks by status
- Mark tasks as completed
- Manage task workflows

This repository contains a working application with **intentional bugs and performance issues** that you need to identify and fix, followed by implementing a new feature.

---

## Tech Stack

- **Frontend**: React (Vite) + Tailwind CSS
- **Backend**: Node.js (Express.js) + node-postgres (`pg` library)
- **Database**: PostgreSQL

---

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

---

## Setup Instructions

### 1. Database Setup

First, create and initialize the PostgreSQL database:

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE taskflow;

# Exit psql
\q

# Run the initialization script
psql -U postgres -d taskflow -f db/init.sql

```

Alternatively, you can run the SQL script directly from your PostgreSQL client (pgAdmin, DBeaver, etc.).

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file from example
cp .env.example .env

# Update .env with your database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=taskflow
# DB_USER=postgres
# DB_PASSWORD=your_password_here
# PORT=5001

# Start the development server
npm run dev

```

The backend API will be running at `http://localhost:5001`

### 3. Frontend Setup

Open a new terminal window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev

```

The frontend application will be running at `http://localhost:3001`

### 4. Verify Setup

* Frontend: Open `http://localhost:3001` in your browser
* Backend Health Check: Visit `http://localhost:5001/api/health`
* You should see a list of tasks loaded from the database

---

## The Mission

### Part 1: Debugging & Optimization

An AI assistant helped write the backend filtering logic and frontend state update functionality. However, our QA team has reported several critical issues.

**User & QA Bug Reports:**

1. ⚠️ **Critical Security Flag**: Our automated scanner flagged the `/api/tasks` endpoint. The current AI-generated code might expose us to database attacks when users filter the tasks by status.
2. ⚠️ **Performance Degradation**: "When the database has thousands of users, the task list takes way too long to load. It seems like the database is being hit unnecessarily many times for a single page load."
3. ⚠️ **Poor UX**: "When I click the 'Complete' button on a task, nothing happens on the screen. But if I hit F5 (refresh), the status changes. The reactivity is broken."

**Your Tasks:**

1. Identify the root cause of all three issues mentioned above and fix them.
2. Document what was wrong and how you fixed it.
3. Ensure all tests pass and the application works correctly.

---

### Part 2: Feature Development - Export to CSV

After fixing the bugs, implement a new "Export to CSV" feature.

**Requirements:**

1. **Frontend**:
* Add a "Download CSV" button to the task list page.
* The button should be visibly disabled or show a loading state while processing the download.
* When clicked, it should trigger a CSV file download in the browser.


2. **Backend**:
* Create a new endpoint: `GET /api/tasks/export` that returns a CSV file with task data.


3. **CRITICAL Business Rule**:
* The exported CSV **MUST reflect exactly what the user currently sees on the screen**.
* If the user has filtered the view to only show "pending" tasks, the downloaded CSV must *only* contain those specific pending tasks. You decide the best architectural approach to connect this frontend state to your new backend endpoint.


4. **CSV Format Expected**:
```
ID,Title,Description,Status,Assigned User,Created Date

```



---

## Existing API Reference

### GET /api/tasks

Fetch all tasks or filter by status.

**Query Parameters:**

* `status` (optional): Filter tasks by status (`pending`, `in-progress`, `completed`)

### PUT /api/tasks/:id/status

Update a task's status.

**Request Body:**

```json
{
  "status": "pending" | "in-progress" | "completed"
}

```

---

## Folder Structure

```
taskflow-assessment/
├── frontend/                # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/                 # Express backend application
│   ├── server.js           # Main server file
│   ├── package.json
│   └── .env.example        # Environment variables template
│
├── db/                      # Database scripts
│   └── init.sql            # Schema and seed data
│
└── README.md               # This file

```

---

## Submission Guidelines

### ✅ You ARE ALLOWED to Use AI Tools!

We heavily encourage the use of AI assistants (Cursor, Claude, ChatGPT, GitHub Copilot, etc.) during this assessment. Since this role requires working with AI, we want to see exactly how you leverage these tools effectively in your development workflow.

### What to Submit

1. **Complete Code**:
* ZIP file of your entire project folder, OR
* GitHub repository link (make sure it's public or shared with us)


2. **AI Prompt History Document** (REQUIRED):
* Export or take screenshots of your AI conversation history (e.g., Cursor chat logs, ChatGPT links, Claude exports).
* Show us the prompts you used to:
* Understand and debug the codebase.
* Implement the fixes and the new CSV feature.


* *Note: We evaluate your prompt engineering, your ability to guide the AI, and how you handle AI hallucinations.*


3. **Solution Summary** (in your AI history document or a separate `SOLUTION.md` file):
* A brief technical explanation of the 3 bugs found and your approach to fixing them.
* A brief description of your Export to CSV architectural decision.



### Evaluation Criteria

We will assess:

* ✅ **Problem-Solving & Auditing**: How accurately you identified the AI-generated bugs.
* ✅ **AI Tool Usage**: Effective use of AI assistants (not just blind copy-pasting, but understanding, steering, and refining the AI's output).
* ✅ **Code Quality & Architecture**: Clean, readable, and maintainable code integration.
* ✅ **Feature Implementation**: Working CSV export that strictly adheres to the business rules.

---


Good luck! We're excited to see your solution and how you approach these challenges. 🚀
