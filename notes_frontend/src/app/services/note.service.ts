import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Note } from '../models/note.model';
import { environment } from '../../environments/environment';
import { deleteNote as mockDeleteNote, listNotes as mockListNotes, getNote as mockGetNote, createNote as mockCreateNote, updateNote as mockUpdateNote } from './mock-notes-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoteService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiBaseUrl}/notes`;

  // PUBLIC_INTERFACE
  async getAll(): Promise<Note[]> {
    /** Fetch all notes. Falls back to mock API if configured. */
    if (environment.useMockApi) {
      return mockListNotes();
    }
    return firstValueFrom(this.http.get<Note[]>(this.baseUrl));
  }

  // PUBLIC_INTERFACE
  async getById(id: string): Promise<Note | undefined> {
    /** Fetch a note by id. */
    if (environment.useMockApi) {
      return mockGetNote(id);
    }
    return firstValueFrom(this.http.get<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`));
  }

  // PUBLIC_INTERFACE
  async create(payload: { title: string; content: string }): Promise<Note> {
    /** Create a new note. */
    if (environment.useMockApi) {
      return mockCreateNote(payload);
    }
    return firstValueFrom(this.http.post<Note>(this.baseUrl, payload));
  }

  // PUBLIC_INTERFACE
  async update(id: string, payload: { title: string; content: string }): Promise<Note | undefined> {
    /** Update an existing note by id. */
    if (environment.useMockApi) {
      return mockUpdateNote(id, payload);
    }
    return firstValueFrom(this.http.put<Note>(`${this.baseUrl}/${encodeURIComponent(id)}`, payload));
  }

  // PUBLIC_INTERFACE
  async remove(id: string): Promise<boolean> {
    /** Delete a note by id. Returns true on success. */
    if (environment.useMockApi) {
      return mockDeleteNote(id);
    }
    await firstValueFrom(this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(id)}`));
    return true;
  }
}
