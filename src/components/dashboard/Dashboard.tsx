import { useState, useMemo } from 'react';
import { Plus, Search, Filter, FileText, DollarSign, Briefcase, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { NoteCard } from '@/components/notes/NoteCard';
import { NoteForm } from '@/components/notes/NoteForm';
import { useAuth } from '@/hooks/useAuth';
import { useNotes, Note } from '@/hooks/useNotes';
import { useToast } from '@/hooks/use-toast';

const categoryIcons = {
  personal: FileText,
  financial: DollarSign,
  work: Briefcase,
  other: MoreHorizontal,
};

const categoryLabels = {
  personal: 'Pribadi',
  financial: 'Keuangan',
  work: 'Pekerjaan',
  other: 'Lainnya',
};

export const Dashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);

  const { user } = useAuth();
  const { notes, addNote, updateNote, deleteNote, getNotesByUser } = useNotes();
  const { toast } = useToast();

  const userNotes = useMemo(() => {
    if (!user) return [];
    return getNotesByUser(user.id);
  }, [notes, user, getNotesByUser]);

  const filteredNotes = useMemo(() => {
    return userNotes.filter(note => {
      const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          note.content.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || note.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [userNotes, searchQuery, selectedCategory]);

  const categoryStats = useMemo(() => {
    const stats = userNotes.reduce((acc, note) => {
      acc[note.category] = (acc[note.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(categoryLabels).map(([key, label]) => ({
      key,
      label,
      count: stats[key] || 0,
      icon: categoryIcons[key as keyof typeof categoryIcons],
    }));
  }, [userNotes]);

  const handleSaveNote = async (noteData: { title: string; content: string; category: Note['category'] }) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (editingNote) {
        updateNote(editingNote.id, noteData);
        toast({
          title: "Catatan diperbarui",
          description: "Catatan Anda berhasil diperbarui.",
        });
      } else {
        addNote({ ...noteData, userId: user.id });
        toast({
          title: "Catatan disimpan",
          description: "Catatan baru berhasil ditambahkan.",
        });
      }
      
      setShowForm(false);
      setEditingNote(null);
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan catatan.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      deleteNote(noteId);
      toast({
        title: "Catatan dihapus",
        description: "Catatan berhasil dihapus dari brankas.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus catatan.",
        variant: "destructive",
      });
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingNote(null);
  };

  if (showForm) {
    return (
      <div className="min-h-screen vault-container flex items-center justify-center p-6">
        <NoteForm
          note={editingNote || undefined}
          onSave={handleSaveNote}
          onCancel={handleCancelForm}
          isLoading={isLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen vault-container">
      <div className="container mx-auto px-6 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-vault-gold mb-2">
            Selamat datang, {user?.username}
          </h1>
          <p className="text-muted-foreground">
            Kelola informasi sensitif Anda dengan aman di brankas digital
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {categoryStats.map(({ key, label, count, icon: Icon }) => (
            <div key={key} className="vault-glass p-4 rounded-lg border border-vault-border">
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-vault-surface/50">
                  <Icon className="h-5 w-5 text-vault-gold" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{count}</p>
                  <p className="text-sm text-muted-foreground">{label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Cari catatan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="secure-input pl-10"
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="secure-input w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="vault-glass border-vault-border">
              <SelectItem value="all">Semua Kategori</SelectItem>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setShowForm(true)}
            className="vault-glow transition-vault"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tambah Catatan
          </Button>
        </div>

        {/* Active Filters */}
        {(searchQuery || selectedCategory !== 'all') && (
          <div className="flex flex-wrap gap-2 mb-6">
            {searchQuery && (
              <Badge variant="outline" className="border-vault-border">
                Pencarian: "{searchQuery}"
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => setSearchQuery('')}
                >
                  ×
                </Button>
              </Badge>
            )}
            {selectedCategory !== 'all' && (
              <Badge variant="outline" className="border-vault-border">
                Kategori: {categoryLabels[selectedCategory as keyof typeof categoryLabels]}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-auto p-0 ml-2"
                  onClick={() => setSelectedCategory('all')}
                >
                  ×
                </Button>
              </Badge>
            )}
          </div>
        )}

        {/* Notes Grid */}
        {filteredNotes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="vault-glass max-w-md mx-auto p-8 rounded-lg border border-vault-border">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {userNotes.length === 0 ? 'Brankas Kosong' : 'Tidak Ada Hasil'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {userNotes.length === 0 
                  ? 'Mulai simpan informasi sensitif Anda dengan menambahkan catatan pertama.'
                  : 'Tidak ditemukan catatan yang sesuai dengan pencarian Anda.'
                }
              </p>
              {userNotes.length === 0 && (
                <Button
                  onClick={() => setShowForm(true)}
                  className="vault-glow transition-vault"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Tambah Catatan Pertama
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};