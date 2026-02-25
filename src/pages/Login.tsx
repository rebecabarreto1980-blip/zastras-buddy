import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getVendedores } from '@/lib/store';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Store, Sparkles } from 'lucide-react';

const Login = () => {
  const [selectedId, setSelectedId] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const vendedores = getVendedores().filter(v => v.ativo);

  const handleEntrar = () => {
    if (!selectedId) return;
    if (selectedId === 'admin') {
      login({ id: 'admin', nome: 'Administrador', role: 'admin' });
      navigate('/admin');
    } else {
      const v = vendedores.find(v => v.id === selectedId);
      if (v) {
        login({ id: v.id, nome: v.nome, role: 'vendedor' });
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-zastras-soft">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="bg-card rounded-2xl shadow-zastras-lg p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-20 h-20 rounded-2xl gradient-zastras flex items-center justify-center shadow-zastras mb-4">
              <Store className="w-10 h-10 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-zastras">ZASTRAS</h1>
            <p className="text-muted-foreground text-sm font-medium">Shopping Cidade Jardim</p>
            <p className="text-muted-foreground text-xs">Brinquedos & Livros Educativos</p>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <Sparkles className="w-4 h-4 text-zastras-purple" />
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Selection */}
          <div className="space-y-3">
            <p className="text-center text-sm text-foreground font-semibold">
              👋 Olá! Selecione seu nome para entrar:
            </p>

            <Select value={selectedId} onValueChange={setSelectedId}>
              <SelectTrigger className="h-12 text-base border-2 border-border focus:border-primary">
                <SelectValue placeholder="Selecione seu nome" />
              </SelectTrigger>
              <SelectContent>
                {vendedores.map(v => (
                  <SelectItem key={v.id} value={v.id} className="text-base py-3">
                    {v.nome} (vendedor{v.nome.endsWith('o') || v.nome === 'João' ? '' : 'a'})
                  </SelectItem>
                ))}
                <SelectItem value="admin" className="text-base py-3 font-semibold">
                  Administrador
                </SelectItem>
              </SelectContent>
            </Select>

            <Button
              onClick={handleEntrar}
              disabled={!selectedId}
              className="w-full h-12 text-base font-bold gradient-zastras text-primary-foreground shadow-zastras hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              ENTRAR
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            *Não precisa de senha, é só escolher seu nome
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
