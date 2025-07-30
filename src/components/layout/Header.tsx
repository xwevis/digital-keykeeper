import { Shield, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  onLogout?: () => void;
}

export const Header = ({ onLogout }: HeaderProps) => {
  const { user, isAuthenticated } = useAuth();

  return (
    <header className="vault-glass border-b border-vault-border backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Shield className="h-8 w-8 text-vault-gold vault-glow" />
              <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm"></div>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-vault-gold">Brankas Digital</h1>
              <p className="text-sm text-muted-foreground">Safe Deposit Box</p>
            </div>
          </div>

          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>{user?.username}</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onLogout}
                className="border-vault-border hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50 transition-vault"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Keluar
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};