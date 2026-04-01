'use client';

import { useState } from 'react';
import { Plus, MessageSquare } from 'lucide-react';
import type { Note } from '@/types';

interface NotesSectionProps {
  notes: Note[];
  onAdd: (note: Note) => void;
}

export default function NotesSection({ notes, onAdd }: NotesSectionProps) {
  const [newNote, setNewNote] = useState('');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!newNote.trim()) return;
    onAdd({
      id: `note-${Date.now()}`,
      content: newNote.trim(),
      created_at: new Date().toISOString(),
      author: 'Admin',
    });
    setNewNote('');
    setAdding(false);
  };

  return (
    <section aria-label="Notes">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-white/70 flex items-center gap-2">
          <MessageSquare className="h-4 w-4" aria-hidden="true" />
          Notes
        </h3>
        {!adding && (
          <button
            onClick={() => setAdding(true)}
            className="text-xs text-[#FF6B00] hover:text-[#E55F00] font-medium flex items-center gap-1 min-h-[44px] px-2"
            aria-label="Add a note"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add Note
          </button>
        )}
      </div>

      {adding && (
        <div className="mb-4 space-y-2">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full rounded-lg bg-white/[0.04] border border-white/[0.08] px-3 py-2 text-sm text-white/90 placeholder:text-white/30 min-h-[80px] resize-none"
            aria-label="Note content"
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              disabled={!newNote.trim()}
              className="px-3 py-1.5 rounded-lg bg-[#FF6B00] text-white text-xs font-semibold disabled:opacity-40 min-h-[36px]"
            >
              Save
            </button>
            <button
              onClick={() => { setAdding(false); setNewNote(''); }}
              className="px-3 py-1.5 rounded-lg bg-white/[0.06] text-white/60 text-xs font-medium min-h-[36px]"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {notes.length === 0 && !adding ? (
        <p className="text-sm text-white/30 italic">No notes yet.</p>
      ) : (
        <div className="space-y-2">
          {[...notes].reverse().map((note) => (
            <div
              key={note.id}
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2"
            >
              <p className="text-sm text-white/80">{note.content}</p>
              <p className="text-[11px] text-white/30 mt-1">
                {note.author} &middot;{' '}
                {new Date(note.created_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: 'numeric',
                  minute: '2-digit',
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
