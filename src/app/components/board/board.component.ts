import { Component, inject, signal, computed } from '@angular/core';
import { AppStateService } from '../../store/app-state.service';
import { ColumnService } from '../../services/columns/column.service';
import { TaskService } from '../../services/tasks/task.service';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { 
  CdkDragDrop, 
  DragDropModule 
} from '@angular/cdk/drag-drop';
import { Project, Column, Task } from '../../models/kanban.model';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule, FormsModule, DragDropModule, RouterModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.css'
})
export class BoardComponent {
  private appState = inject(AppStateService);
  private columnService = inject(ColumnService);
  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  protected readonly Date = Date;
  projectId = this.route.snapshot.paramMap.get('id')!;
  project = computed(() => this.appState.state().projects.find(p => p.id === this.projectId));

 
  showAddColumn = signal(false);
  newColumnTitle = signal('');
  
  showAddTask = signal<{columnId: string} | null>(null);
  newTaskTitle = signal('');

  showDeleteColumn = signal<{columnId: string} | null>(null);
  transferColumnId = signal('');

  editingColumn = signal<{id: string, title: string} | null>(null);
  editColumnTitle = signal('');

  editingTask = signal<{columnId: string, task: Task} | null>(null);
  editTaskTitle = signal('');

  selectedTask = signal<Task | null>(null);

  drop(event: CdkDragDrop<Task[]>, columnId: string) {
    this.taskService.moveTask(
      this.projectId,
      event.item.data.id,
      event.previousContainer.id,
      columnId,
      event.currentIndex
    );
  }

  addTask() {
    if (this.newTaskTitle().trim() && this.showAddTask()) {
      this.taskService.addTask(this.projectId, this.showAddTask()!.columnId, this.newTaskTitle().trim());
      this.newTaskTitle.set('');
      this.showAddTask.set(null);
    }
  }

  saveEditTask() {
    if (this.editingTask() && this.editTaskTitle().trim()) {
      this.taskService.editTask(
        this.projectId,
        this.editingTask()!.columnId,
        this.editingTask()!.task.id,
        this.editTaskTitle().trim()
      );
      this.editingTask.set(null);
    }
  }
  addColumn() {
    if (this.newColumnTitle().trim()) {
      this.columnService.addColumn(this.projectId, this.newColumnTitle().trim());
      this.newColumnTitle.set('');
      this.showAddColumn.set(false);
    }
  }

  startEditColumn(column: Column) {
    this.editingColumn.set({ id: column.id, title: column.title });
    this.editColumnTitle.set(column.title);
  }

  saveEditColumn() {
    if (this.editingColumn() && this.editColumnTitle().trim()) {
      this.columnService.renameColumn(this.projectId, this.editingColumn()!.id, this.editColumnTitle().trim());
      this.editingColumn.set(null);
    }
  }

  confirmDeleteColumn() {
    if (this.showDeleteColumn() && this.transferColumnId()) {
      this.columnService.deleteColumn(
        this.projectId, 
        this.showDeleteColumn()!.columnId, 
        this.transferColumnId()
      );
      this.showDeleteColumn.set(null);
      this.transferColumnId.set('');
    }
  }

  deleteTask(columnId: string, taskId: string, event: Event) {
    event.stopPropagation();
    if (confirm('Delete this task?')) {
      this.taskService.deleteTask(this.projectId, columnId, taskId);
    }
  }

  formatDuration(ms: number): string {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`;
  }
}
