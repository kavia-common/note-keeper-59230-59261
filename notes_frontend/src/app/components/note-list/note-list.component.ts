import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-note-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.css']
})
export class NoteListComponent {
  private noteService = inject(NoteService);
  notes = signal<Note[] | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  search = signal<string>('');

  constructor() {
    effect(() => {
      void this.loadNotes();
    });
  }

  async loadNotes() {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.noteService.getAll();
      this.notes.set(data);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load notes');
    } finally {
      this.loading.set(false);
    }
  }

  filteredNotes(): Note[] {
    const q = this.search().trim().toLowerCase();
    const list = this.notes() ?? [];
    if (!q) return list;
    return list.filter(n => n.title.toLowerCase().includes(q) || n.content.toLowerCase().includes(q));
  }

  async deleteNote(note: Note) {
    if (!confirm(`Delete note "${note.title}"?`)) return;
    try {
      await this.noteService.remove(note.id);
      await this.loadNotes();
    } catch (e: any) {
      alert(e?.message ?? 'Failed to delete note');
    }
  }

  trackById(_: number, n: Note) {
    return n.id;
  }
}
