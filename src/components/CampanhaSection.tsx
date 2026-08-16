import React, { useMemo, useState } from 'react';
import { Cliente } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SegmentoBadge, { SEGMENTOS } from '@/components/SegmentoBadge';
import PausarContatoBadge from '@/components/PausarContatoBadge';
import HistoricoList from '@/components/HistoricoList';
import { useHistoricos, useRegistrarContato, devePausarContato } from '@/hooks/useHistorico';
import { getWhatsAppLink, formatarTelefone } from '@/lib/store';
import { Send, ChevronDown, ChevronUp } from 'lucide-react';

interface Props {
  clientes: Cliente[];
  adminVendedorId?: string;
}

const CampanhaSection: React.FC<Props> = ({ clientes, adminVendedorId }) => {
  const [filtroSegmento, setFiltroSegmento] = useState('todos');
  const [mensagem, setMensagem] = useState('Olá {nome}! 💜 Aqui é da ZASTRAS, temos novidades especiais para você!');
  const [enviados, setEnviados] = useState<string[]>([]);
  const [expandido, setExpandido] = useState<string | null>(null);

  const { data: historicos = [] } = useHistoricos();
  const registrar = useRegistrarContato();

  const porCliente = useMemo(() => {
    const map: Record<string, typeof historicos> = {};
    historicos.forEach(h => {
      (map[h.clienteId] ||= []).push(h);
    });
    return map;
  }, [historicos]);

  const lista = useMemo(
    () => (filtroSegmento === 'todos' ? clientes : clientes.filter(c => c.segmento === filtroSegmento)),
    [clientes, filtroSegmento]
  );

  const handleEnviar = async (c: Cliente) => {
    const texto = mensagem.replaceAll('{nome}', c.nomeCliente);
    window.open(getWhatsAppLink(c.telefone, texto), '_blank');
    await registrar.mutateAsync({
      clienteId: c.id,
      vendedorId: adminVendedorId,
      tipoContato: 'whatsapp',
      mensagemEnviada: texto,
    });
    setEnviados(prev => (prev.includes(c.id) ? prev : [...prev, c.id]));
  };

  return (
    <section className="animate-fade-in">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Campanha</h2>
        <Badge variant="outline" className="text-xs">{enviados.length} enviados</Badge>
      </div>

      <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3">
        <Select value={filtroSegmento} onValueChange={setFiltroSegmento}>
          <SelectTrigger className="h-11 border-2 sm:w-56">
            <SelectValue placeholder="Segmento" />
          </SelectTrigger>
          <SelectContent className="bg-popover z-50">
            <SelectItem value="todos">Todos os segmentos</SelectItem>
            {SEGMENTOS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
          </SelectContent>
        </Select>

        <Textarea
          value={mensagem}
          onChange={e => setMensagem(e.target.value)}
          rows={4}
          placeholder="Use {nome} para personalizar"
        />
        <p className="text-xs text-muted-foreground">Use <code>{'{nome}'}</code> para inserir o nome do cliente.</p>

        <div className="space-y-2">
          {lista.map(c => {
            const hs = porCliente[c.id] || [];
            const pausar = devePausarContato(hs);
            const aberto = expandido === c.id;
            return (
              <div key={c.id} className="border rounded-lg p-3 bg-muted/30">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium text-sm text-foreground">{c.nomeCliente}</span>
                      <SegmentoBadge segmento={c.segmento} />
                      {pausar && <PausarContatoBadge />}
                      {enviados.includes(c.id) && (
                        <Badge variant="outline" className="text-xs border-success text-success">Enviado</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{formatarTelefone(c.telefone)}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" className="h-8 text-xs gradient-zastras text-primary-foreground" onClick={() => handleEnviar(c)}>
                      <Send className="w-3 h-3 mr-1" /> Abrir WhatsApp
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setExpandido(aberto ? null : c.id)}>
                      {aberto ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                {aberto && (
                  <div className="mt-3">
                    <HistoricoList historicos={hs} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CampanhaSection;
