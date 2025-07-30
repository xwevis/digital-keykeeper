import { useState } from 'react';
import { Calendar, Edit2, Trash2, FileText, DollarSign, Briefcase, MoreHorizontal } from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Note } from '@/hooks/useNotes';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onDelete: (id: string) => void;
}

const categoryIcons = {
  personal: FileText,
  financial: DollarSign,
  work: Briefcase,
  other: MoreHorizontal,
};

const categoryColors = {
  personal: 'bg-vault-blue/20 text-vault-blue border-vault-blue/30',
  financial: 'bg-vault-gold/20 text-vault-gold border-vault-gold/30',
  work: 'bg-accent/20 text-accent-foreground border-accent/30',
  other: 'bg-muted/20 text-muted-foreground border-muted/30',
};

const categoryLabels = {
  personal: 'Pribadi',
  financial: 'Keuangan',
  work: 'Pekerjaan',
  other: 'Lainnya',
};

export const NoteCard = ({ note, onEdit, onDelete }: NoteCardProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const IconComponent = categoryIcons[note.category];
  
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Card className="vault-glass hover:shadow-vault transition-vault group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-vault-surface/50 border border-vault-border">
                <IconComponent className="h-4 w-4 text-vault-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-foreground truncate">{note.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge variant="outline" className={categoryColors[note.category]}>
                    {categoryLabels[note.category]}
                  </Badge>
                </div>
              </div>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="vault-glass border-vault-border">
                <DropdownMenuItem onClick={() => onEdit(note)}>
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem 
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Hapus
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm leading-relaxed mb-4">
            {truncateContent(note.content)}
          </p>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <Calendar className="h-3 w-3 mr-1" />
            <span>Dibuat {formatDate(note.createdAt)}</span>
            {note.updatedAt.getTime() !== note.createdAt.getTime() && (
              <>
                <span className="mx-2">•</span>
                <span>Diperbarui {formatDate(note.updatedAt)}</span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="vault-glass border-vault-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-vault-gold">Hapus Catatan</AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              Apakah Anda yakin ingin menghapus catatan "{note.title}"? 
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel 
              onClick={() => setShowDeleteDialog(false)}
              className="border-vault-border hover:bg-vault-surface"
            >
              Batal
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(note.id);
                setShowDeleteDialog(false);
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};