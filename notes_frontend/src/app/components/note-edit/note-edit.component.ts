import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NoteService } from '../../services/note.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Note } from '../../models/note.model';

@Component({
  selector: 'app-note-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './note-edit.component.html',
  styleUrls: ['./note-edit.component.css']
})
export class NoteEditComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private noteService = inject(NoteService);

  mode = signal<'create' | 'edit'>('create');
  id = signal<string | null>(null);
  title = signal<string>('');
  content = signal<string>('');
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.mode.set('edit');
      this.id.set(id);
      await this.loadNote(id);
    } else {
      this.mode.set('create');
    }
  }

  async loadNote(id: string) {
    try {
      this.loading.set(true);
      const note = await this.noteService.getById(id);
      if (!note) {
        this.error.set('Note not found');
        return;
      }
      this.title.set(note.title);
      this.content.set(note.content);
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to load note');
    } finally {
      this.loading.set(false);
    }
  }

  async onSubmit() {
    const payload = { title: this.title().trim(), content: this.content().trim() };
    if (!payload.title) {
      this.error.set('Title is required');
      return;
    }
    try {
      this.loading.set(true);
      this.error.set(null);
      if (this.mode() === 'create') {
        const created: Note = await this.noteService.create(payload);
        await this.router.navigate(['/notes', created.id]);
      } else {
        const id = this.id();
        if (!id) return;
        const updated = await this.noteService.update(id, payload);
        if (!updated) {
          this.error.set('Update failed: note not found');
          return;
        }
        await this.router.navigate(['/notes', id]);
      }
    } catch (e: any) {
      this.error.set(e?.message ?? 'Failed to save note');
    } finally {
      this.loading.set(false);
    }
  }
}
