import { Component, inject, signal } from '@angular/core';
import { AppStateService } from '../../store/app-state.service';
import { ProjectService } from '../../services/projects/project.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Project } from '../../models/kanban.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  private appState = inject(AppStateService);
  private projectService = inject(ProjectService);
  private router = inject(Router);

  state = this.appState.state;
  newProjectName = signal('');
  userNameInput = signal('');
  
  editingProject = signal<Project | null>(null);
  editProjectName = signal('');

  get totalTasks() {
    return (project: Project) => {
      return project.columns.reduce((acc: number, col: any) => acc + col.tasks.length, 0);
    };
  }

  submitOnboarding() {
    if (this.userNameInput().trim()) {
      this.appState.setUserName(this.userNameInput().trim());
    }
  }

  createProject() {
    if (this.newProjectName().trim()) {
      const id = this.projectService.createProject(this.newProjectName().trim());
      this.newProjectName.set('');
      this.router.navigate(['/project', id]);
    }
  }

  startEditProject(event: Event, project: Project) {
    event.preventDefault();
    event.stopPropagation();
    this.editingProject.set(project);
    this.editProjectName.set(project.name);
  }

  saveEditProject() {
    if (this.editingProject() && this.editProjectName().trim()) {
      this.projectService.renameProject(this.editingProject()!.id, this.editProjectName().trim());
      this.editingProject.set(null);
    }
  }

  deleteProject(event: Event, id: string) {
    event.preventDefault();
    event.stopPropagation();
    if (confirm('Are you sure you want to delete this project? All tasks and columns will be lost.')) {
      this.projectService.deleteProject(id);
    }
  }
}
