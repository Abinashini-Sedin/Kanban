
import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../../store/app-state.service';
import { Task } from '../../models/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private store = inject(AppStateService);

  private getColumnTitle(projectId: string, columnId: string): string {
    const project = this.store.state().projects.find(p => p.id === projectId);
    return project?.columns.find(c => c.id === columnId)?.title || columnId;
  }

  addTask(projectId: string, columnId: string, title: string) {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      description: '',
      createdAt: Date.now(),
      currentColumnId: columnId,
      timeLogs: [{
        columnId,
        columnTitle: this.getColumnTitle(projectId, columnId),
        startTime: Date.now(),
        durationMs: 0
      }]
    };

    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          columns: p.columns.map(c => {
            if (c.id === columnId) {
              return { ...c, tasks: [...c.tasks, newTask] };
            }
            return c;
          })
        };
      }
      return p;
    }));
  }

  moveTask(projectId: string, taskId: string, fromColumnId: string, toColumnId: string, newIndex: number) {
    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        let taskToMove: Task | null = null;
        
        // Remove from source
        const updatedColumns = p.columns.map(c => {
          if (c.id === fromColumnId) {
            taskToMove = c.tasks.find(t => t.id === taskId) || null;
            return { ...c, tasks: c.tasks.filter(t => t.id !== taskId) };
          }
          return c;
        });

        if (!taskToMove) return p;

        // Update task time logs
        const now = Date.now();
        const task: Task = taskToMove;
        const updatedTask = { ...task };
        
        // Close previous log
        const lastLog = updatedTask.timeLogs[updatedTask.timeLogs.length - 1];
        if (lastLog) {
          lastLog.endTime = now;
          lastLog.durationMs = now - lastLog.startTime;
        }

        // Add new log for new column
        updatedTask.currentColumnId = toColumnId;
        updatedTask.timeLogs.push({
          columnId: toColumnId,
          columnTitle: this.getColumnTitle(projectId, toColumnId),
          startTime: now,
          durationMs: 0
        });

        // Insert into destination
        return {
          ...p,
          columns: updatedColumns.map(c => {
            if (c.id === toColumnId) {
              const newTasks = [...c.tasks];
              newTasks.splice(newIndex, 0, updatedTask!);
              return { ...c, tasks: newTasks };
            }
            return c;
          })
        };
      }
      return p;
    }));
  }

  editTask(projectId: string, columnId: string, taskId: string, newTitle: string) {
    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          columns: p.columns.map(c => {
            if (c.id === columnId) {
              return {
                ...c,
                tasks: c.tasks.map(t => t.id === taskId ? { ...t, title: newTitle } : t)
              };
            }
            return c;
          })
        };
      }
      return p;
    }));
  }

  deleteTask(projectId: string, columnId: string, taskId: string) {
    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          columns: p.columns.map(c => {
            if (c.id === columnId) {
              return { ...c, tasks: c.tasks.filter(t => t.id !== taskId) };
            }
            return c;
          })
        };
      }
      return p;
    }));
  }
}
