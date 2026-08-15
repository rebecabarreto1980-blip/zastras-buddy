import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser, UserRole } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

/** Resolve o vendedor correspondente à sessão e garante o vínculo auth_user_id. */
async function resolveVendedor(authUserId: string, email?: string | null): Promise<AuthUser | null> {
  const { data: byId } = await supabase
    .from('vendedores')
    .select('id, nome, role')
    .eq('auth_user_id', authUserId)
    .maybeSingle();
  if (byId) return { id: byId.id, nome: byId.nome, role: (byId as any).role as UserRole };

  if (!email) return null;
  const { data: byEmail } = await supabase
    .from('vendedores')
    .select('id, nome, role')
    .eq('email_auth', email.toLowerCase())
    .maybeSingle();
  if (!byEmail) return null;

  await supabase.from('vendedores').update({ auth_user_id: authUserId } as any).eq('id', byEmail.id);
  return { id: byEmail.id, nome: byEmail.nome, role: (byEmail as any).role as UserRole };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const handle = (session: any) => {
      if (!session?.user) {
        if (mounted) { setUser(null); setLoading(false); }
        return;
      }
      resolveVendedor(session.user.id, session.user.email).then(u => {
        if (mounted) { setUser(u); setLoading(false); }
      });
    };

    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setTimeout(() => handle(session), 0);
    });
    supabase.auth.getSession().then(({ data }) => handle(data.session));

    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
