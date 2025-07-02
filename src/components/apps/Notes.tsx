import React, { useState, useEffect } from 'react';
import { Plus, Search, FileText, Trash2 } from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  modified: Date;
}

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note! You can create, edit, and delete notes here.\n\nFeatures:\n• Rich text editing\n• Auto-save\n• Search functionality\n• Beautiful interface',
      modified: new Date(),
    },
    {
      id: '2',
      title: 'Project Ideas',
      content: '1. Desktop OS Interface\n2. Task Management App\n3. Weather Dashboard\n4. Music Player\n5. File Explorer',
      modified: new Date(Date.now() - 86400000),
    },
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editContent, setEditContent] = useState(selectedNote?.content || '');

  useEffect(() => {
    if (selectedNote) {
      setEditContent(selectedNote.content);
    }
  }, [selectedNote]);

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Untitled Note',
      content: '',
      modified: new Date(),
    };
    setNotes(prev => [newNote, ...prev]);
    setSelectedNote(newNote);
  };

  const updateNote = (content: string) => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      content,
      modified: new Date(),
    };
    
    setNotes(prev => prev.map(note => 
      note.id === selectedNote.id ? updatedNote : note
    ));
    setSelectedNote(updatedNote);
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.find(note => note.id !== noteId) || null);
    }
  };

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="h-full flex bg-gray-50 dark:bg-slate-900 text-sm">
      {/* Notes List */}
      <div className="w-80 bg-slate-100 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col">
        {/* Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-gray-800 dark:text-slate-100">Notes</h2>
            <button
              onClick={createNewNote}
              className="p-1.5 rounded-md bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            >
              <Plus size={16} />
            </button>
          </div>
          
          <div className="relative">
            <Search size={15} className="absolute left-2.5 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-slate-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white/70 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className={`
                p-3 border-b border-slate-200 dark:border-slate-800 cursor-pointer transition-colors group relative
                ${selectedNote?.id === note.id 
                  ? 'bg-slate-200/60 dark:bg-slate-800' 
                  : 'hover:bg-slate-200/40 dark:hover:bg-slate-800/50'
                }
              `}
              onClick={() => setSelectedNote(note)}
            >
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium truncate ${selectedNote?.id === note.id ? 'text-gray-900 dark:text-slate-50' : 'text-gray-800 dark:text-slate-200'}`}>
                  {note.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-slate-400 mt-1 line-clamp-2">
                  {note.content.substring(0, 100) || "No content"}...
                </p>
                <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                  {formatDate(note.modified)}
                </p>
              </div>
              
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 rounded text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Note Editor */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedNote ? (
          <>
            <div className="p-6 pb-4 border-b border-gray-200">
              <input
                type="text"
                value={selectedNote.title}
                onChange={(e) => {
                  const updatedNote = { ...selectedNote, title: e.target.value };
                  setSelectedNote(updatedNote);
                  setNotes(prev => prev.map(note => 
                    note.id === selectedNote.id ? updatedNote : note
                  ));
                }}
                className="text-2xl font-semibold bg-transparent border-none outline-none text-gray-800 w-full placeholder:text-gray-300"
                placeholder="Title"
              />
              <p className="text-xs text-gray-400 mt-1">
                Modified {formatDate(selectedNote.modified)}
              </p>
            </div>
            
            <div className="flex-1 p-6 pt-4">
              <textarea
                value={editContent}
                onChange={(e) => {
                  setEditContent(e.target.value);
                  updateNote(e.target.value);
                }}
                placeholder="Start writing..."
                className="w-full h-full resize-none bg-transparent border-none outline-none text-gray-700 text-base leading-relaxed placeholder:text-gray-400"
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 bg-white">
            <div className="text-center">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg">Select a note to start editing</p>
              <p className="text-sm mt-1">or create a new one</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}