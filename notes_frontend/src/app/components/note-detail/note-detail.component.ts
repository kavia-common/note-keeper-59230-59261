import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './note-detail.component.html',
  styleUrls: ['./note-detail.component.css']
})
export class NoteDetailComponent {
  private route = inject(ActivatedRoute);
  private noteService = inject(NoteService);
  note = signal<Note | null>(null);
  loading = signal<boolean>(true);
  error = signal<string | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing note id');
      this.loading.set(false);
      return;
    }
    try {
      this.error.set(null);
      this.loading.set(true);
      const n = await this.noteService.getById(id);
      if (!n) {
        this.error.set('Note not found');
      } else {
        this.note.set(n);
      }
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load note');
    } finally {
      this.loading.set(false);
    }
  }
}
