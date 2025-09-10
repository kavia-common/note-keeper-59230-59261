/**
 * Simple in-memory "database" for mock API operations.
 * Provides basic CRUD and simulates network latency.
 */
import { Note } from '../models/note.model';

const nowIso = () => new Date().toISOString();

// Start with some sample notes
let notes: Note[] = [
  {
    id: '1',
    title: 'Welcome to Notes',
    content: 'This is your first note. Feel free to edit or delete it.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
  {
    id: '2',
    title: 'Angular Tips',
    content: 'Use standalone components and provideRouter for simpler apps in Angular 15+.',
    createdAt: nowIso(),
    updatedAt: nowIso(),
  },
];

function uid() {
  return Math.random().toString(36).substring(2, 10);
}

function simulateLatency<T>(result: T, ms = 250): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(result), ms);
    // no-op reference to ensure variable usage under strict checks
    void timer;
  });
}

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  /** Returns all notes. */
  return simulateLatency([...notes].sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)));
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note | undefined> {
  /** Returns a note by id or undefined if not found. */
  const found = notes.find(n => n.id === id);
  return simulateLatency(found ? { ...found } : undefined);
}

// PUBLIC_INTERFACE
export async function createNote(data: { title: string; content: string }): Promise<Note> {
  /** Creates a new note with generated id and timestamps. */
  const newNote: Note = {
    id: uid(),
    title: data.title,
    content: data.content,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  notes = [newNote, ...notes];
  return simulateLatency(newNote);
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, data: { title: string; content: string }): Promise<Note | undefined> {
  /** Updates an existing note. Returns updated note or undefined if not found. */
  const index = notes.findIndex(n => n.id === id);
  if (index === -1) return simulateLatency(undefined);
  const updated: Note = { ...notes[index], ...data, updatedAt: nowIso() };
  notes[index] = updated;
  return simulateLatency(updated);
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<boolean> {
  /** Deletes a note by id. Returns true if deleted, false otherwise. */
  const prevLen = notes.length;
  notes = notes.filter(n => n.id !== id);
  return simulateLatency(notes.length < prevLen);
}
