import { Injectable, signal, effect } from '@angular/core';
import { AppState, Project } from '../models/kanban.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  private readonly STORAGE_KEY = 'kanban_app_state';
  
  state = signal<AppState>(this.loadState());

  constructor() {
    effect(() => {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.state()));
    });
  }

  private loadState(): AppState {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch (e) {
        console.error('Failed to parse stored state', e);
      }
    }
    return {
      userName: null,
      projects: []
    };
  }

  setUserName(name: string | null) {
    this.state.update(s => ({ ...s, userName: name }));
  }

  setProjects(updater: (projects: Project[]) => Project[]) {
    this.state.update(s => ({
      ...s,
      projects: updater(s.projects)
    }));
  }
}
