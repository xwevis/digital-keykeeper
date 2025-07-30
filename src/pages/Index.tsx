import { useState } from 'react';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { useAuth } from '@/hooks/useAuth';
import vaultHero from '@/assets/vault-hero.jpg';

const Index = () => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen vault-container">
        <Header onLogout={handleLogout} />
        <Dashboard />
      </div>
    );
  }

  return (
    <div className="min-h-screen vault-container">
      <Header />
      
      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Shield className="h-12 w-12 text-vault-gold vault-glow" />
                  <div className="absolute -inset-2 bg-primary/20 rounded-full blur-lg pulse-secure"></div>
                </div>
                <div>
                  <h1 className="text-4xl lg:text-5xl font-bold text-vault-gold">
                    Brankas Digital
                  </h1>
                  <p className="text-xl text-muted-foreground">
                    Safe Deposit Box untuk Era Digital
                  </p>
                </div>
              </div>
              
              <p className="text-lg text-muted-foreground leading-relaxed">
                Simpan dan kelola informasi sensitif Anda dengan tingkat keamanan bank. 
                Dilengkapi enkripsi berlapis dan validasi ketat untuk melindungi data pribadi Anda.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground mb-4">
                Fitur Keamanan Tinggi:
              </h3>
              <div className="grid gap-4">
                {[
                  {
                    icon: Lock,
                    title: 'Enkripsi End-to-End',
                    description: 'Data Anda terenkripsi dengan standar perbankan'
                  },
                  {
                    icon: Eye,
                    title: 'Akses Terkontrol',
                    description: 'Hanya Anda yang dapat mengakses catatan pribadi'
                  },
                  {
                    icon: CheckCircle,
                    title: 'Validasi Input Ketat',
                    description: 'Proteksi berlapis terhadap serangan siber'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="p-2 rounded-lg bg-vault-surface/50 border border-vault-border mt-1">
                      <feature.icon className="h-4 w-4 text-vault-gold" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{feature.title}</h4>
                      <p className="text-sm text-muted-foreground">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative rounded-2xl overflow-hidden shadow-vault">
              <img 
                src={vaultHero} 
                alt="Digital Vault Security" 
                className="w-full h-64 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-vault-dark/80 to-transparent"></div>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm text-vault-gold font-medium">
                  Teknologi keamanan terdepan untuk melindungi aset digital Anda
                </p>
              </div>
            </div>
          </div>

          {/* Auth Section */}
          <div className="flex items-center justify-center">
            {authMode === 'login' ? (
              <LoginForm onSwitchToRegister={() => setAuthMode('register')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setAuthMode('login')} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
