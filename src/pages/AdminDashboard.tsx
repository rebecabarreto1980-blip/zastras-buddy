import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { getVendedores, getClientes, addVendedor, removeVendedor, updateVendedor, formatarTelefone, getWhatsAppLink, getMensagem1 } from '@/lib/store';
import ClientDetailModal from '@/components/ClientDetailModal';
import { Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Store, LogOut, Users, UserPlus, Search, Eye, MessageSquare, Trash2, Edit, ChevronDown, ChevronUp } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);
  const [busca, setBusca] = useState('');
  const [showAddVendedor, setShowAddVendedor] = useState(false);
  const [novoVendedorNome, setNovoVendedorNome] = useState('');
  const [showDetail, setShowDetail] = useState<Cliente | null>(null);
  const [expandedVendedor, setExpandedVendedor] = useState<string | null>(null);

  const refresh = () => setRefreshKey(k => k + 1);

  const vendedores = useMemo(() => getVendedores().filter(v => v.ativo), [refreshKey]);
  const todosClientes = useMemo(() => getClientes(), [refreshKey]);

  const clientesFiltrados = useMemo(() => {
    if (!busca.trim()) return todosClientes;
    const q = busca.toLowerCase();
    return todosClientes.filter(c =>
      c.nomeCliente.toLowerCase().includes(q) ||
      c.telefone.includes(q) ||
      c.nomeCrianca?.toLowerCase().includes(q)
    );
  }, [todosClientes, busca]);

  if (!user || user.role !== 'admin') {
    navigate('/');
    return null;
  }

  const handleLogout = () => { logout(); navigate('/'); };

  const handleAddVendedor = () => {
    if (novoVendedorNome.trim()) {
      addVendedor(novoVendedorNome.trim());
      setNovoVendedorNome('');
      setShowAddVendedor(false);
      refresh();
    }
  };

  const handleRemoveVendedor = (id: string) => {
    if (confirm('Remover este vendedor?')) {
      removeVendedor(id);
      refresh();
    }
  };

  const totalClientes = todosClientes.length;
  const totalComCrianca = todosClientes.filter(c => c.nomeCrianca).length;
  const totalPendentes = todosClientes.filter(c => !c.primeiroContatoFeito).length;

  return (
    <div className="min-h-screen bg-background pb-8">
      {/* Header */}
      <header className="gradient-zastras px-4 pt-6 pb-4 shadow-zastras">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-card/20 rounded-xl flex items-center justify-center">
              <Store className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-display font-bold text-primary-foreground">ZASTRAS Admin</h1>
              <p className="text-xs text-primary-foreground/70">Visão Geral</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={handleLogout} className="text-primary-foreground hover:bg-primary-foreground/10">
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 mt-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 animate-fade-in">
          <div className="bg-card rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-primary">{totalClientes}</p>
            <p className="text-xs text-muted-foreground">Total Clientes</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-secondary">{vendedores.length}</p>
            <p className="text-xs text-muted-foreground">Vendedores</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-success">{totalComCrianca}</p>
            <p className="text-xs text-muted-foreground">Com Criança</p>
          </div>
          <div className="bg-card rounded-xl p-4 shadow-sm border text-center">
            <p className="text-2xl font-bold text-warning">{totalPendentes}</p>
            <p className="text-xs text-muted-foreground">1º Contato Pendente</p>
          </div>
        </div>

        {/* Vendedores */}
        <section className="animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display font-bold text-lg">Gerenciar Vendedores</h2>
            <Button size="sm" className="gradient-zastras text-primary-foreground" onClick={() => setShowAddVendedor(true)}>
              <UserPlus className="w-4 h-4 mr-1" /> Adicionar
            </Button>
          </div>
          <div className="space-y-2">
            {vendedores.map(v => {
              const clientesDoVendedor = todosClientes.filter(c => c.vendedorId === v.id);
              const total = clientesDoVendedor.length;
              const comContato = clientesDoVendedor.filter(c => c.primeiroContatoFeito).length;
              const pct = total > 0 ? Math.round((comContato / total) * 100) : 0;
              const isExpanded = expandedVendedor === v.id;

              return (
                <div key={v.id} className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex-1">
                      <p className="font-bold text-foreground">{v.nome}</p>
                      <p className="text-sm text-muted-foreground">{total} clientes</p>
                      <div className="mt-2 flex items-center gap-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full gradient-zastras rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-muted-foreground font-medium">{pct}%</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 ml-3">
                      <Button variant="ghost" size="icon" onClick={() => setExpandedVendedor(isExpanded ? null : v.id)} className="text-muted-foreground">
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveVendedor(v.id)} className="text-destructive">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="border-t px-4 py-3 bg-muted/30 space-y-2">
                      {clientesDoVendedor.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-2">Nenhum cliente</p>
                      ) : (
                        clientesDoVendedor.map(c => (
                          <div key={c.id} className="flex items-center justify-between py-1">
                            <div>
                              <span className="text-sm font-medium text-foreground">{c.nomeCliente}</span>
                              {c.nomeCrianca && <span className="text-xs text-muted-foreground ml-2">👦 {c.nomeCrianca}</span>}
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setShowDetail(c)} className="text-xs">
                              <Eye className="w-3 h-3 mr-1" /> Ver
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Todos os Clientes */}
        <section className="animate-fade-in">
          <h2 className="font-display font-bold text-lg mb-3">Todos os Clientes</h2>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              className="pl-10 h-11 border-2"
            />
          </div>
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left p-3 font-semibold text-foreground">Cliente</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Telefone</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden md:table-cell">Vendedor</th>
                    <th className="text-left p-3 font-semibold text-foreground hidden sm:table-cell">Criança</th>
                    <th className="text-center p-3 font-semibold text-foreground">Status</th>
                    <th className="text-center p-3 font-semibold text-foreground">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientesFiltrados.map(c => {
                    const vendedor = vendedores.find(v => v.id === c.vendedorId);
                    return (
                      <tr key={c.id} className="border-b last:border-0 hover:bg-muted/30">
                        <td className="p-3">
                          <p className="font-medium text-foreground">{c.nomeCliente}</p>
                          <p className="text-xs text-muted-foreground sm:hidden">{formatarTelefone(c.telefone)}</p>
                        </td>
                        <td className="p-3 text-muted-foreground hidden sm:table-cell">{formatarTelefone(c.telefone)}</td>
                        <td className="p-3 text-muted-foreground hidden md:table-cell">{vendedor?.nome || '-'}</td>
                        <td className="p-3 hidden sm:table-cell">{c.nomeCrianca || '-'}</td>
                        <td className="p-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {c.primeiroContatoFeito ? (
                              <Badge variant="outline" className="text-xs border-success text-success">✅</Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs border-warning text-warning">🆕</Badge>
                            )}
                            {c.cupom10Enviado && (
                              <Badge variant="outline" className="text-xs border-secondary text-secondary">🎁</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <div className="flex items-center justify-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-success"
                              onClick={() => window.open(getWhatsAppLink(c.telefone, getMensagem1(c.nomeCliente)), '_blank')}
                            >
                              💬
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowDetail(c)}>
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </div>

      {/* Add Vendedor Dialog */}
      <Dialog open={showAddVendedor} onOpenChange={setShowAddVendedor}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="font-display">Adicionar Vendedor</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Nome do vendedor"
            value={novoVendedorNome}
            onChange={e => setNovoVendedorNome(e.target.value)}
            className="h-11"
            onKeyDown={e => e.key === 'Enter' && handleAddVendedor()}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddVendedor(false)}>Cancelar</Button>
            <Button className="gradient-zastras text-primary-foreground" onClick={handleAddVendedor}>Adicionar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {showDetail && (
        <ClientDetailModal
          cliente={showDetail}
          onClose={() => setShowDetail(null)}
          onUpdated={refresh}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
