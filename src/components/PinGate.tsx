import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Lock } from 'lucide-react';
import zastrasLogo from '@/assets/zastras-logo.png';

const STORE_EMAIL = 'loja@zastras.local';

export default function PinGate({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [pin, setPin] = useState('');
  const [erro, setErro] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setHasSession(!!session);
    });
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setReady(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const desbloquear = async () => {
    if (pin.length !== 6) return;
    setLoading(true);
    setErro('');
    const { error } = await supabase.auth.signInWithPassword({ email: STORE_EMAIL, password: pin });
    setLoading(false);
    if (error) {
      setErro('PIN incorreto');
      setPin('');
    }
  };

  if (!ready) return <div className="min-h-screen gradient-zastras-soft" />;
  if (hasSession) return <>{children}</>;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 gradient-zastras-soft">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="bg-card rounded-2xl shadow-zastras-lg p-8 space-y-6 text-center">
          <div className="mx-auto w-20 h-20 rounded-2xl overflow-hidden shadow-zastras">
            <img src={zastrasLogo} alt="Zastras" className="w-full h-full object-cover" />
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl font-display font-bold text-gradient-zastras">ZASTRAS</h1>
            <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
              <Lock className="w-3.5 h-3.5" /> Digite o PIN da loja
            </p>
          </div>

          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={pin}
              onChange={(v) => { setPin(v.replace(/\D/g, '')); setErro(''); }}
              inputMode="numeric"
            >
              <InputOTPGroup>
                {[0, 1, 2, 3, 4, 5].map(i => (
                  <InputOTPSlot key={i} index={i} className="h-12 w-10 text-lg" />
                ))}
              </InputOTPGroup>
            </InputOTP>
          </div>

          {erro && <p className="text-sm font-medium text-destructive">{erro}</p>}

          <Button
            onClick={desbloquear}
            disabled={pin.length !== 6 || loading}
            className="w-full h-12 text-base font-bold gradient-zastras text-primary-foreground shadow-zastras hover:opacity-90 disabled:opacity-40"
          >
            {loading ? 'Verificando...' : 'DESBLOQUEAR'}
          </Button>
        </div>
      </div>
    </div>
  );
}