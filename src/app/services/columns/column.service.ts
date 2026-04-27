import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../../store/app-state.service';
import { Column } from '../../models/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class ColumnService {
  private store = inject(AppStateService);

  private getColumnTitle(projectId: string, columnId: string): string {
    const project = this.store.state().projects.find(p => p.id === projectId);
    return project?.columns.find(c => c.id === columnId)?.title || columnId;
  }

  addColumn(projectId: string, title: string) {
    const newColumn: Column = {
      id: crypto.randomUUID(),
      title,
      tasks: [],
      isDefault: false
    };

    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        const completedIndex = p.columns.findIndex(c => c.id === 'completed');
        const newColumns = [...p.columns];
        if (completedIndex !== -1) {
          newColumns.splice(completedIndex, 0, newColumn);
        } else {
          newColumns.push(newColumn);
        }
        return { ...p, columns: newColumns };
      }
      return p;
    }));
  }

  renameColumn(projectId: string, columnId: string, newTitle: string) {
    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        return {
          ...p,
          columns: p.columns.map(c => c.id === columnId ? { ...c, title: newTitle } : c)
        };
      }
      return p;
    }));
  }

  deleteColumn(projectId: string, columnId: string, targetColumnId: string) {
    this.store.setProjects(projects => projects.map(p => {
      if (p.id === projectId) {
        const columnToDelete = p.columns.find(c => c.id === columnId);
        if (!columnToDelete || columnToDelete.isDefault) return p;

        // Transfer tasks to target
        const tasksToTransfer = columnToDelete.tasks.map(t => {
          const now = Date.now();
          const lastLog = t.timeLogs[t.timeLogs.length - 1];
          if (lastLog) {
            lastLog.endTime = now;
            lastLog.durationMs = now - lastLog.startTime;
          }
          return {
            ...t,
            currentColumnId: targetColumnId,
            timeLogs: [...t.timeLogs, {
              columnId: targetColumnId,
              columnTitle: this.getColumnTitle(projectId, targetColumnId),
              startTime: now,
              durationMs: 0
            }]
          };
        });

        return {
          ...p,
          columns: p.columns
            .filter(c => c.id !== columnId)
            .map(c => {
              if (c.id === targetColumnId) {
                return { ...c, tasks: [...c.tasks, ...tasksToTransfer] };
              }
              return c;
            })
        };
      }
      return p;
    }));
  }
}
