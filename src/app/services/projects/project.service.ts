import { Injectable, inject } from '@angular/core';
import { AppStateService } from '../../store/app-state.service';
import { Project, Column } from '../../models/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private store = inject(AppStateService);

  get state() {
    return this.store.state;
  }

  createProject(name: string) {
    const defaultColumns: Column[] = [
      { id: 'todo', title: 'Todo', tasks: [], isDefault: true },
      { id: 'working', title: 'Working', tasks: [], isDefault: false },
      { id: 'testing', title: 'Testing', tasks: [], isDefault: false },
      { id: 'review', title: 'Review', tasks: [], isDefault: false },
      { id: 'actual-testing', title: 'Actual Testing', tasks: [], isDefault: false },
      { id: 'completed', title: 'Completed', tasks: [], isDefault: true }
    ];

    const newProject: Project = {
      id: crypto.randomUUID(),
      name,
      columns: defaultColumns,
      createdAt: Date.now()
    };

    this.store.setProjects(projects => [...projects, newProject]);

    return newProject.id;
  }

  renameProject(id: string, newName: string) {
    this.store.setProjects(projects => 
      projects.map(p => p.id === id ? { ...p, name: newName } : p)
    );
  }

  deleteProject(id: string) {
    this.store.setProjects(projects => projects.filter(p => p.id !== id));
  }

  getProject(id: string) {
    return this.store.state().projects.find(p => p.id === id);
  }
}
