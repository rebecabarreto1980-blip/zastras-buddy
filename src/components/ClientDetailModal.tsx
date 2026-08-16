import React, { useState } from 'react';
import { Cliente } from '@/lib/types';
import { useUpdateCliente, useCompras } from '@/hooks/useClientes';
import SegmentoBadge from '@/components/SegmentoBadge';
import { formatarTelefone, getWhatsAppLink, getMensagem1, getMensagem2, calcularIdade, diasDesdeContato, gerarCupom, getMensagem5 } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Save, Gift, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onUpdated: () => void;
}

const ClientDetailModal: React.FC<Props> = ({ cliente: initial, onClose, onUpdated }) => {
  const [c, setC] = useState(initial);
  const updateCliente = useUpdateCliente();
  const { data: compras = [] } = useCompras(c.id);
  const fmtMoeda = (v?: number) =>
    v == null ? '—' : v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const handleSave = async () => {
    await updateCliente.mutateAsync({ id: c.id, data: c });
    onUpdated();
  };

  const handleRegistrarContato = async () => {
    const now = new Date().toISOString().split('T')[0];
    setC(prev => ({ ...prev, ultimoContato: now }));
    await updateCliente.mutateAsync({ id: c.id, data: { ultimoContato: now } });
    onUpdated();
  };

  const handleEnviarCupom = async () => {
    if (!c.nomeCrianca) return;
    const cupom = gerarCupom(c.nomeCrianca);
    const now = new Date().toISOString().split('T')[0];
    const updates = { cupom10Enviado: true, dataCupom: now, codigoCupom: cupom };
    setC(prev => ({ ...prev, ...updates }));
    await updateCliente.mutateAsync({ id: c.id, data: updates });
    const msg = getMensagem5(c.nomeCliente, c.nomeCrianca, cupom);
    window.open(getWhatsAppLink(c.telefone, msg), '_blank');
    onUpdated();
  };

  const dias = diasDesdeContato(c.ultimoContato);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl flex items-center gap-2">
            {c.nomeCliente}
            <SegmentoBadge segmento={c.segmento} />
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5">
          {/* Contact Info */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="border-success text-success"
              onClick={() => window.open(getWhatsAppLink(c.telefone, getMensagem1(c.nomeCliente)), '_blank')}
            >
              💬 {formatarTelefone(c.telefone)}
            </Button>
            <Button variant="outline" size="icon" onClick={() => window.open(`tel:${c.telefone}`)}>
              <Phone className="w-4 h-4" />
            </Button>
          </div>

          {/* Criança */}
          <section className="bg-zastras-light-purple rounded-xl p-4 space-y-3">
            <h3 className="font-display font-bold text-foreground">👶 Criança</h3>
            <div>
              <Label className="text-xs font-semibold">Nome da criança</Label>
              <Input
                value={c.nomeCrianca || ''}
                onChange={e => setC(prev => ({ ...prev, nomeCrianca: e.target.value }))}
                placeholder="Nome da criança"
                className="h-10 mt-1 bg-card"
              />
            </div>
            <div>
              <Label className="text-xs font-semibold">Data de nascimento</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full h-10 mt-1 justify-start bg-card", !c.dataNascimentoCrianca && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {c.dataNascimentoCrianca ? format(new Date(c.dataNascimentoCrianca), "dd/MM/yyyy") : "Selecionar"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={c.dataNascimentoCrianca ? new Date(c.dataNascimentoCrianca) : undefined}
                    onSelect={(d) => setC(prev => ({ ...prev, dataNascimentoCrianca: d?.toISOString().split('T')[0] }))}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            {c.dataNascimentoCrianca && (
              <p className="text-sm text-muted-foreground">Idade: {calcularIdade(c.dataNascimentoCrianca)} anos</p>
            )}
          </section>

          {/* Primeiro Contato */}
          <section className="bg-muted rounded-xl p-4 space-y-3">
            <h3 className="font-display font-bold text-foreground">📞 Primeiro Contato</h3>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={c.primeiroContatoFeito}
                onCheckedChange={(checked) => setC(prev => ({
                  ...prev,
                  primeiroContatoFeito: !!checked,
                  dataPrimeiroContato: checked ? (prev.dataPrimeiroContato || new Date().toISOString().split('T')[0]) : undefined,
                }))}
              />
              <Label className="text-sm">Primeiro contato realizado</Label>
            </div>
            {c.dataPrimeiroContato && (
              <p className="text-xs text-muted-foreground">Data: {format(new Date(c.dataPrimeiroContato), "dd/MM/yyyy")}</p>
            )}
          </section>

          {/* Último Contato */}
          <section className="bg-muted rounded-xl p-4 space-y-3">
            <h3 className="font-display font-bold text-foreground">🕐 Último Contato</h3>
            {c.ultimoContato ? (
              <p className="text-sm text-muted-foreground">
                {format(new Date(c.ultimoContato), "dd/MM/yyyy")} ({dias === 0 ? 'hoje' : `${dias} dias atrás`})
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Nenhum contato registrado</p>
            )}
            <Button size="sm" variant="outline" onClick={handleRegistrarContato}>
              Registrar Contato Agora
            </Button>
          </section>

          {/* Observações */}
          {/* Histórico de Compras */}
          <section className="bg-muted rounded-xl p-4 space-y-3">
            <h3 className="font-display font-bold text-foreground">🛍️ Histórico de Compras</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-card rounded-lg p-2">
                <p className="text-sm font-bold text-primary">{fmtMoeda(c.valorTotalGasto)}</p>
                <p className="text-[10px] text-muted-foreground">Total gasto</p>
              </div>
              <div className="bg-card rounded-lg p-2">
                <p className="text-sm font-bold text-foreground">
                  {c.ultimaCompra ? format(new Date(c.ultimaCompra), 'dd/MM/yyyy') : '—'}
                </p>
                <p className="text-[10px] text-muted-foreground">Última compra</p>
              </div>
              <div className="bg-card rounded-lg p-2">
                <p className="text-sm font-bold text-foreground">{c.qtdCompras ?? 0}</p>
                <p className="text-[10px] text-muted-foreground">Compras</p>
              </div>
            </div>
            {compras.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhuma compra registrada</p>
            ) : (
              <ul className="space-y-2">
                {compras.map(compra => (
                  <li key={compra.id} className="bg-card rounded-lg p-2 flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-foreground">
                        {format(new Date(compra.dataCompra), 'dd/MM/yyyy')}
                      </p>
                      {compra.produtos ? (
                        <ul className="list-disc list-inside text-xs text-muted-foreground mt-1 space-y-0.5">
                          {compra.produtos.split(';').map((item, idx) => (
                            <li key={idx}>{item.trim()}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-muted-foreground">—</p>
                      )}
                    </div>
                    <span className="text-xs font-bold text-primary whitespace-nowrap">{fmtMoeda(compra.valor)}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section>
            <Label className="text-sm font-semibold">📝 Observações</Label>
            <Textarea
              value={c.observacoes || ''}
              onChange={e => setC(prev => ({ ...prev, observacoes: e.target.value }))}
              placeholder="Observações sobre o cliente..."
              className="mt-1"
              rows={3}
            />
          </section>

          {/* Cupom */}
          <section className="bg-zastras-light-red rounded-xl p-4 space-y-3">
            <h3 className="font-display font-bold text-foreground">🎁 Cupom 10%</h3>
            {c.cupom10Enviado ? (
              <div>
                <p className="text-sm font-mono font-bold text-primary">{c.codigoCupom}</p>
                <p className="text-xs text-muted-foreground">Enviado em {c.dataCupom && format(new Date(c.dataCupom), "dd/MM/yyyy")}</p>
              </div>
            ) : (
              <div>
                <p className="text-sm text-muted-foreground mb-2">Cupom ainda não enviado</p>
                {c.nomeCrianca && (
                  <Button size="sm" className="gradient-zastras text-primary-foreground" onClick={handleEnviarCupom}>
                    <Gift className="w-4 h-4 mr-1" /> Gerar e Enviar Cupom
                  </Button>
                )}
              </div>
            )}
          </section>

          {/* Save */}
          <Button
            className="w-full gradient-zastras text-primary-foreground h-12 font-bold"
            onClick={handleSave}
            disabled={updateCliente.isPending}
          >
            <Save className="w-4 h-4 mr-2" /> {updateCliente.isPending ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ClientDetailModal;
