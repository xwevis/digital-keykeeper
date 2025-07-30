import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  category: 'personal' | 'financial' | 'work' | 'other';
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

interface NotesState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, updates: Partial<Pick<Note, 'title' | 'content' | 'category'>>) => void;
  deleteNote: (id: string) => void;
  getNotesByUser: (userId: string) => Note[];
  getNote: (id: string, userId: string) => Note | undefined;
}

export const useNotes = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],

      addNote: (noteData) => {
        const newNote: Note = {
          ...noteData,
          id: Math.random().toString(36).substr(2, 9),
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        set((state) => ({
          notes: [...state.notes, newNote],
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note
          ),
        }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      getNotesByUser: (userId) => {
        return get().notes.filter((note) => note.userId === userId);
      },

      getNote: (id, userId) => {
        return get().notes.find((note) => note.id === id && note.userId === userId);
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);