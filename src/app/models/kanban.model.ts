export interface TaskTimeLog {
  columnId: string;
  columnTitle: string;
  startTime: number;
  endTime?: number;
  durationMs: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  createdAt: number;
  timeLogs: TaskTimeLog[];
  currentColumnId: string;
}

export interface Column {
  id: string;
  title: string;
  tasks: Task[];
  isDefault?: boolean;
}

export interface Project {
  id: string;
  name: string;
  columns: Column[];
  createdAt: number;
}

export interface AppState {
  userName: string | null;
  projects: Project[];
}
