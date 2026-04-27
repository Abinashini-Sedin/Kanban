# ⏱️ Timed Personal Kanban

Welcome to the **Timed Personal Kanban**! This application is a sleek, single-user task management board built entirely on the frontend using Angular. It allows you to organize multiple projects, manage custom columns, and best of all—automatically track how much time you spend on every single task, in every single phase of your work.

---

## ✨ Features

- **No Backend, Pure Local State**: Everything stays inside your browser via local storage.
- **Micro-Animations & Premium Design**: Enjoy our minimalist, human-friendly interface designed with an `Inter` font, soft borders, and glassmorphic touches.
- **Multiple Projects**: Create separate workspaces for separate goals (e.g. "Work", "Side Project").
- **Custom Workflows**: Add, rename, or delete columns to match your personal style (while keeping standard Todo and Completion states).
- **Drag and Drop**: Simply pick a task up and throw it into the next column via Angular CDK.
- **Automatic Time Tracking**: From the moment a task is created, a timer runs. Move it to a new column, and the old timer stops while a new one begins! Review the full history whenever you want.

---

## 🏗️ Architecture & Services

To keep our code readable, maintainable, and highly decoupled, we recently split up our business logic into several specialized domain services. Here's how it all fits together:

**1. `AppStateService` (`src/app/store/app-state.service.ts`)**

- Think of this as the "Brain" or "Database".
- It holds the master record of your current state using **Angular Signals** (`this.state`).
- It automatically handles saving your work to `localStorage` whenever a change happens so you never lose data on refresh.

**2. `ProjectService` (`src/app/services/projects/project.service.ts`)**

- Specifically designed to create, rename, fetch, and delete _entire projects_.

**3. `ColumnService` (`src/app/services/columns/column.service.ts`)**

- Focused strictly on boards. It lets you add new phases (like "Testing", "Review"), rename them, and safely delete them (we even let you move your tasks to another column when you delete one!).

**4. `TaskService` (`src/app/services/tasks/task.service.ts`)**

- The powerhouse of the board. Handles creating, editing, dropping/moving, and deleting tasks.
- **It also acts as the timekeeper**. Whenever you call `moveTask`, this service actively computes how long an item was in its previous phase, closes the `timeLog`, and spawns a new one.

---

## 🚀 How to Run Locally

You only need **Node.js** installed on your machine!

1. **Navigate to the app folder:**

   ```bash
   cd Kanban_app
   ```

2. **Install Packages (if you haven't already):**

   ```bash
   npm install
   ```

3. **Start the Development Server:**

   ```bash
   npm start
   ```

   _(Alternatively, run `ng serve` if you have Angular CLI globally installed)_

4. **Open in Browser:**
   Go to [http://localhost:4200](http://localhost:4200)

Enjoy tracking your time and organizing your tasks! 📋
