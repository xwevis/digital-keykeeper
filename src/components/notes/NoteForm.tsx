import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Note } from '@/hooks/useNotes';

interface NoteFormProps {
  note?: Note;
  onSave: (noteData: { title: string; content: string; category: Note['category'] }) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const categoryOptions = [
  { value: 'personal', label: 'Pribadi' },
  { value: 'financial', label: 'Keuangan' },
  { value: 'work', label: 'Pekerjaan' },
  { value: 'other', label: 'Lainnya' },
] as const;

export const NoteForm = ({ note, onSave, onCancel, isLoading = false }: NoteFormProps) => {
  const [formData, setFormData] = useState({
    title: note?.title || '',
    content: note?.content || '',
    category: note?.category || 'personal' as Note['category'],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title,
        content: note.content,
        category: note.category,
      });
    }
  }, [note]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Title validation
    if (!formData.title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Judul minimal 3 karakter';
    } else if (formData.title.length > 100) {
      newErrors.title = 'Judul maksimal 100 karakter';
    } else if (!/^[a-zA-Z0-9\s\-_.,!?()]+$/.test(formData.title)) {
      newErrors.title = 'Judul mengandung karakter yang tidak diizinkan';
    }
    
    // Content validation
    if (!formData.content.trim()) {
      newErrors.content = 'Konten wajib diisi';
    } else if (formData.content.length < 10) {
      newErrors.content = 'Konten minimal 10 karakter';
    } else if (formData.content.length > 5000) {
      newErrors.content = 'Konten maksimal 5000 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Sanitize input data
    const sanitizedData = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: formData.category,
    };

    onSave(sanitizedData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="vault-glass w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-vault-gold">
          {note ? 'Edit Catatan' : 'Tambah Catatan Baru'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Judul Catatan
            </Label>
            <Input
              id="title"
              type="text"
              placeholder="Masukkan judul catatan..."
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="secure-input"
              disabled={isLoading}
              maxLength={100}
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.title.length}/100 karakter
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">
              Kategori
            </Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              disabled={isLoading}
            >
              <SelectTrigger className="secure-input">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="vault-glass border-vault-border">
                {categoryOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Konten
            </Label>
            <Textarea
              id="content"
              placeholder="Masukkan konten catatan Anda di sini..."
              value={formData.content}
              onChange={(e) => handleInputChange('content', e.target.value)}
              className="secure-input min-h-[200px] resize-none"
              disabled={isLoading}
              maxLength={5000}
            />
            {errors.content && (
              <p className="text-sm text-destructive">{errors.content}</p>
            )}
            <p className="text-xs text-muted-foreground">
              {formData.content.length}/5000 karakter
            </p>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="border-vault-border hover:bg-vault-surface"
            >
              <X className="h-4 w-4 mr-2" />
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="vault-glow transition-vault"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                  <span>Menyimpan...</span>
                </div>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {note ? 'Perbarui' : 'Simpan'}
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};