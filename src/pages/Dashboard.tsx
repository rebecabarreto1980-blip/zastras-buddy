import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getClientesByVendedor, getClientes, getLembretes, formatarTelefone, getWhatsAppLink, getMensagem1, diasDesdeContato, isAniversarioHoje, isAniversarioProximo, calcularIdade, updateCliente, addHistorico, updateLembrete, getMensagem3 } from '@/lib/store';
import { Cliente, Lembrete } from '@/lib/types';
import ClientCard from '@/components/ClientCard';
import AddClientModal from '@/components/AddClientModal';
import RegisterChildModal from '@/components/RegisterChildModal';
import ClientDetailModal from '@/components/ClientDetailModal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Plus, LogOut, Store, Gift, Clock, MessageCircle, CalendarHeart, Bell } from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'clientes' | 'lembretes'>('clientes');
  const [busca, setBusca] = useState('');
  const [showAddClient, setShowAddClient] = useState(false);
  const [showRegisterChild, setShowRegisterChild] = useState<Cliente | null>(null);
  const [showDetail, setShowDetail] = useState<Cliente | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const refresh = () => setRefreshKey(k => k + 1);

  const clientes = useMemo(() => {
    if (!user) return [];
    const all = user.role === 'admin' ? getClientes() : getClientesByVendedor(user.id);
    if (!busca.trim()) return all;
    const q = busca.toLowerCase();
    return all.filter(c =>
      c.nomeCliente.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      c.nomeCrianca?.toLowerCase().includes(q)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, busca, refreshKey]);

  const lembretes = useMemo(() => {
    if (!user) return [];
    const all = getLembretes();
    if (user.role === 'admin') return all.filter(l => l.status === 'pendente');
    return all.filter(l => l.vendedorId === user.id && l.status === 'pendente');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, refreshKey]);

  const aniversariosHoje = useMemo(() => {
    return clientes.filter(c => c.dataNascimentoCrianca && isAniversarioHoje(c.dataNascimentoCrianca));
  }, [clientes]);

  const followUpNecessario = useMemo(() => {
    return clientes.filter(c => {
      const dias = diasDesdeContato(c.ultimoContato);
      return dias === null || dias > 30;
    });
  }, [clientes]);

  const contatoPendente = useMemo(() => {
    return clientes.filter(c => !c.primeiroContatoFeito);
  }, [clientes]);

  if (!user) {
    navigate('/');
    return null;
  }

  const handleLogout = () => { logout(); navigate('/'); };

  const handleRegistrarContato = (cliente: Cliente) => {
    updateCliente(cliente.id, { ultimoContato: new Date().toISOString().split('T')[0] });
    if (user) {
      addHistorico({
        clienteId: cliente.id,
        vendedorId: user.id,
        dataContato: new Date().toISOString(),
        tipoContato: 'whatsapp',
      });
    }
    refresh();
  };

  const handleEnviarAniversario = (cliente: Cliente) => {
    if (!cliente.nomeCrianca) return;
    const msg = getMensagem3(cliente.nomeCliente, cliente.nomeCrianca);
    const link = getWhatsAppLink(cliente.telefone, msg);
    window.open(link, '_blank');
    handleRegistrarContato(cliente);
  };

  const totalLembretes = aniversariosHoje.length + followUpNecessario.length + contatoPendente.length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <header className="gradient-zastras px-4 pt-6 pb-4 shadow-zastras">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-card/20 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-primary-foreground">ZASTRAS</h1>
              <p className="text-xs text-primary-foreground/70">Shopping Cidade Jardim</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-primary-foreground font-medium">
              Olá, {user.nome} 👋
            </span>
            <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="max-w-lg mx-auto px-4 -mt-3">
        <div className="bg-card rounded-xl shadow-md flex overflow-hidden">
          <button
            onClick={() => setTab('clientes')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${tab === 'clientes' ? 'gradient-zastras text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <MessageCircle className="w-4 h-4" />
            Meus Clientes
          </button>
          <button
            onClick={() => setTab('lembretes')}
            className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${tab === 'lembretes' ? 'gradient-zastras text-primary-foreground' : 'text-muted-foreground hover:bg-muted'}`}
          >
            <Bell className="w-4 h-4" />
            Lembretes
            {totalLembretes > 0 && (
              <span className="absolute top-1.5 right-4 w-5 h-5 bg-destructive text-destructive-foreground text-xs font-bold rounded-full flex items-center justify-center">
                {totalLembretes}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-4">
        {tab === 'clientes' && (
          <div className="space-y-4 animate-fade-in">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou telefone..."
                value={busca}
                onChange={e => setBusca(e.target.value)}
                className="pl-10 h-11 border-2"
              />
            </div>

            {/* Stats */}
            <div className="flex gap-2">
              <div className="flex-1 bg-zastras-light-red rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-primary">{clientes.length}</p>
                <p className="text-xs text-muted-foreground">Clientes</p>
              </div>
              <div className="flex-1 bg-zastras-light-purple rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-secondary">{clientes.filter(c => c.nomeCrianca).length}</p>
                <p className="text-xs text-muted-foreground">Com criança</p>
              </div>
              <div className="flex-1 bg-muted rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-foreground">{clientes.filter(c => c.cupom10Enviado).length}</p>
                <p className="text-xs text-muted-foreground">Cupons</p>
              </div>
            </div>

            {/* Client Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {clientes.map(c => (
                <ClientCard
                  key={c.id}
                  cliente={c}
                  onDetail={() => setShowDetail(c)}
                  onRegisterChild={() => setShowRegisterChild(c)}
                  onRegistrarContato={() => handleRegistrarContato(c)}
                />
              ))}
            </div>

            {clientes.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Nenhum cliente encontrado</p>
                <p className="text-sm">Adicione seu primeiro cliente!</p>
              </div>
            )}
          </div>
        )}

        {tab === 'lembretes' && (
          <div className="space-y-6 animate-fade-in">
            {/* Aniversários Hoje */}
            {aniversariosHoje.length > 0 && (
              <section>
                <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-3">
                  🎂 Aniversários Hoje
                </h3>
                <div className="space-y-2">
                  {aniversariosHoje.map(c => (
                    <div key={c.id} className="bg-card rounded-xl p-4 shadow-sm border-2 border-warning/30 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{c.nomeCrianca}</p>
                        <p className="text-sm text-muted-foreground">Filho(a) de {c.nomeCliente}</p>
                        <p className="text-xs text-muted-foreground">{c.dataNascimentoCrianca && `${calcularIdade(c.dataNascimentoCrianca)} anos hoje!`}</p>
                      </div>
                      <Button size="sm" className="gradient-zastras text-primary-foreground" onClick={() => handleEnviarAniversario(c)}>
                        <Gift className="w-4 h-4 mr-1" /> Enviar
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Follow-up */}
            {followUpNecessario.length > 0 && (
              <section>
                <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-3">
                  ⏰ Follow-up Necessário
                </h3>
                <div className="space-y-2">
                  {followUpNecessario.map(c => {
                    const dias = diasDesdeContato(c.ultimoContato);
                    return (
                      <div key={c.id} className="bg-card rounded-xl p-4 shadow-sm border flex items-center justify-between">
                        <div>
                          <p className="font-bold text-foreground">{c.nomeCliente}</p>
                          <p className="text-sm text-muted-foreground">
                            {dias === null ? 'Sem contato registrado' : `${dias} dias sem contato`}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-primary text-primary"
                          onClick={() => {
                            const msg = getMensagem1(c.nomeCliente);
                            window.open(getWhatsAppLink(c.telefone, msg), '_blank');
                            handleRegistrarContato(c);
                          }}
                        >
                          💬 WhatsApp
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Primeiro contato pendente */}
            {contatoPendente.length > 0 && (
              <section>
                <h3 className="font-display font-bold text-lg flex items-center gap-2 mb-3">
                  🆕 Primeiro Contato Pendente
                </h3>
                <div className="space-y-2">
                  {contatoPendente.map(c => (
                    <div key={c.id} className="bg-card rounded-xl p-4 shadow-sm border-2 border-info/30 flex items-center justify-between">
                      <div>
                        <p className="font-bold text-foreground">{c.nomeCliente}</p>
                        <p className="text-sm text-muted-foreground">{formatarTelefone(c.telefone)}</p>
                      </div>
                      <Button
                        size="sm"
                        className="gradient-zastras text-primary-foreground"
                        onClick={() => {
                          const msg = getMensagem1(c.nomeCliente);
                          window.open(getWhatsAppLink(c.telefone, msg), '_blank');
                          updateCliente(c.id, {
                            primeiroContatoFeito: true,
                            dataPrimeiroContato: new Date().toISOString().split('T')[0],
                            ultimoContato: new Date().toISOString().split('T')[0],
                          });
                          refresh();
                        }}
                      >
                        Enviar Msg 1
                      </Button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {totalLembretes === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <CalendarHeart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-medium">Tudo em dia! 🎉</p>
                <p className="text-sm">Nenhum lembrete pendente</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowAddClient(true)}
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full gradient-zastras shadow-zastras-lg text-primary-foreground flex items-center justify-center text-2xl font-bold z-50 hover:scale-105 transition-transform active:scale-95"
      >
        <Plus className="w-7 h-7" />
      </button>

      {/* Modals */}
      {showAddClient && (
        <AddClientModal
          vendedorId={user.id}
          onClose={() => setShowAddClient(false)}
          onSaved={() => { setShowAddClient(false); refresh(); }}
        />
      )}
      {showRegisterChild && (
        <RegisterChildModal
          cliente={showRegisterChild}
          onClose={() => setShowRegisterChild(null)}
          onSaved={() => { setShowRegisterChild(null); refresh(); }}
        />
      )}
      {showDetail && (
        <ClientDetailModal
          cliente={showDetail}
          onClose={() => setShowDetail(null)}
          onUpdated={() => { refresh(); }}
        />
      )}
    </div>
  );
};

export default Dashboard;
