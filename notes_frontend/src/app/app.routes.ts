import { Routes } from '@angular/router';
import { NoteListComponent } from './components/note-list/note-list.component';
import { NoteDetailComponent } from './components/note-detail/note-detail.component';
import { NoteEditComponent } from './components/note-edit/note-edit.component';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', component: NoteListComponent },
  { path: 'notes/new', component: NoteEditComponent },
  { path: 'notes/:id', component: NoteDetailComponent },
  { path: 'notes/:id/edit', component: NoteEditComponent },
  { path: '**', component: NotFoundComponent }
];
