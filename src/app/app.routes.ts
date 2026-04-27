import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { BoardComponent } from './components/board/board.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'project/:id', component: BoardComponent },
  { path: '**', redirectTo: '' }
];
