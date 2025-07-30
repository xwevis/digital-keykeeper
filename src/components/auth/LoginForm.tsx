import { useState } from 'react';
import { Eye, EyeOff, Lock, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { authenticate } = useAuth();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'Username atau email wajib diisi';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password wajib diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await authenticate(formData.username, formData.password);
      
      if (success) {
        toast({
          title: "Login berhasil",
          description: "Selamat datang di Brankas Digital!",
        });
      } else {
        toast({
          title: "Login gagal",
          description: "Username atau password tidak valid",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Terjadi kesalahan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className="vault-glass w-full max-w-md">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold text-vault-gold">Masuk ke Brankas</CardTitle>
        <CardDescription className="text-muted-foreground">
          Akses informasi sensitif Anda dengan aman
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-medium">
              Username atau Email
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="username"
                type="text"
                placeholder="Masukkan username atau email"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="secure-input pl-10"
                disabled={isLoading}
              />
            </div>
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="secure-input pl-10 pr-10"
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full vault-glow transition-vault"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                <span>Memverifikasi...</span>
              </div>
            ) : (
              'Masuk'
            )}
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Belum memiliki akun?{' '}
              <Button
                type="button"
                variant="link"
                className="p-0 h-auto text-vault-gold hover:text-vault-gold-glow"
                onClick={onSwitchToRegister}
              >
                Daftar sekarang
              </Button>
            </p>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};