import { useMemo, useState } from 'react';
import { useVendedoresLogin } from '@/hooks/useVendedores';
import { supabase } from '@/integrations/supabase/client';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sparkles, ArrowLeft, ShieldCheck } from 'lucide-react';
import zastrasLogo from '@/assets/zastras-logo.png';

const ADMIN_EMAIL = 'admin@zastras.local';

const Login = () => {
  const [modoAdmin, setModoAdmin] = useState(false);
  const [selectedId, setSelectedId] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);
  const [primeiroAcesso, setPrimeiroAcesso] = useState(false);

  const { data: vendedores = [], isLoading } = useVendedoresLogin();
  const lista = useMemo(() => vendedores.filter(v => v.role === 'vendedor' && v.emailAuth), [vendedores]);

  const emailSelecionado = modoAdmin
    ? ADMIN_EMAIL
    : lista.find(v => v.id === selectedId)?.emailAuth;

  const entrar = async () => {
    if (!emailSelecionado || senha.length < 6) return;
    setLoading(true);
    setErro('');

    if (primeiroAcesso) {
      const { error } = await supabase.auth.signUp({
        email: emailSelecionado,
        password: senha,
        options: { emailRedirectTo: window.location.origin },
      });
      setLoading(false);
      if (error) {
        setErro(error.message.includes('already') ? 'Essa pessoa já tem senha cadastrada.' : 'Não foi possível criar a senha.');
        return;
      }
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email: emailSelecionado, password: senha });
    setLoading(false);
    if (error) {
      setErro('Senha incorreta. Se é seu primeiro acesso, toque em "Primeiro acesso".');
      setSenha('');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-zastras-soft">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="bg-card rounded-2xl shadow-zastras-lg p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="mx-auto w-24 h-24 rounded-2xl overflow-hidden shadow-zastras mb-4">
              <img src={zastrasLogo} alt="Zastras Logo" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gradient-zastras">ZASTRAS</h1>
            <p className="text-muted-foreground text-sm font-medium">Shopping Cidade Jardim</p>
            <p className="text-muted-foreground text-xs">Brinquedos &amp; Livros Educativos</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <Sparkles className="w-4 h-4 text-zastras-purple" />
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-3">
            {modoAdmin ? (
              <p className="text-center text-sm text-foreground font-semibold flex items-center justify-center gap-1">
                <ShieldCheck className="w-4 h-4 text-zastras-purple" /> Acesso do administrador
              </p>
            ) : (
              <>
                <p className="text-center text-sm text-foreground font-semibold">
                  👋 Olá! Selecione seu nome para entrar:
                </p>
                <Select value={selectedId} onValueChange={(v) => { setSelectedId(v); setErro(''); }}>
                  <SelectTrigger className="h-12 text-base border-2 border-border focus:border-primary">
                    <SelectValue placeholder={isLoading ? 'Carregando...' : 'Selecione seu nome'} />
                  </SelectTrigger>
                  <SelectContent>
                    {lista.map(v => (
                      <SelectItem key={v.id} value={v.id} className="text-base py-3">
                        {v.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </>
            )}

            <Input
              type="password"
              value={senha}
              onChange={(e) => { setSenha(e.target.value); setErro(''); }}
              onKeyDown={(e) => { if (e.key === 'Enter') entrar(); }}
              placeholder={primeiroAcesso ? 'Crie sua senha (mín. 6 caracteres)' : 'Sua senha'}
              className="h-12 text-base border-2 border-border focus:border-primary"
              autoComplete={primeiroAcesso ? 'new-password' : 'current-password'}
            />

            {erro && <p className="text-sm font-medium text-destructive text-center">{erro}</p>}

            <Button
              onClick={entrar}
              disabled={!emailSelecionado || senha.length < 6 || loading}
              className="w-full h-12 text-base font-bold gradient-zastras text-primary-foreground shadow-zastras hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              {loading ? 'Aguarde...' : primeiroAcesso ? 'CRIAR SENHA E ENTRAR' : 'ENTRAR'}
            </Button>

            <button
              type="button"
              onClick={() => { setPrimeiroAcesso(!primeiroAcesso); setSenha(''); setErro(''); }}
              className="w-full text-center text-xs text-muted-foreground underline underline-offset-2 hover:text-foreground"
            >
              {primeiroAcesso ? 'Já tenho senha' : 'Primeiro acesso (criar senha)'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => { setModoAdmin(!modoAdmin); setSelectedId(''); setSenha(''); setErro(''); setPrimeiroAcesso(false); }}
            className="w-full text-center text-xs text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          >
            {modoAdmin ? (<><ArrowLeft className="w-3 h-3" /> Voltar para vendedores</>) : 'Sou administrador'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
