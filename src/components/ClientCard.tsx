import React, { useState } from 'react';
import { Cliente } from '@/lib/types';
import { formatarTelefone, diasDesdeContato, isAniversarioProximo, isAniversarioHoje, calcularIdade } from '@/lib/store';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle, Eye, UserPlus, Clock } from 'lucide-react';
import WhatsAppMessagePicker from './WhatsAppMessagePicker';
import SegmentoBadge from './SegmentoBadge';

interface ClientCardProps {
  cliente: Cliente;
  onDetail: () => void;
  onRegisterChild: () => void;
  onRegistrarContato: () => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ cliente, onDetail, onRegisterChild, onRegistrarContato }) => {
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const dias = diasDesdeContato(cliente.ultimoContato);
  const aniversarioProximo = isAniversarioProximo(cliente.dataNascimentoCrianca);
  const aniversarioHoje = isAniversarioHoje(cliente.dataNascimentoCrianca);

  return (
    <>
    <div className="bg-card rounded-xl border shadow-sm p-4 space-y-3 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-foreground truncate">{cliente.nomeCliente}</h3>
          <button
            onClick={() => setShowWhatsApp(true)}
            className="text-sm text-success flex items-center gap-1 hover:underline mt-0.5"
          >
            💬 {formatarTelefone(cliente.telefone)}
          </button>
        </div>
        <div className="flex gap-1 flex-wrap justify-end">
          <SegmentoBadge segmento={cliente.segmento} />
          {cliente.primeiroContatoFeito ? (
            <Badge variant="outline" className="text-xs border-success text-success px-1.5">✅</Badge>
          ) : (
            <Badge variant="outline" className="text-xs border-warning text-warning px-1.5 animate-pulse-soft">🆕</Badge>
          )}
          {aniversarioHoje && <Badge className="text-xs bg-warning text-warning-foreground px-1.5">🎂</Badge>}
          {aniversarioProximo && !aniversarioHoje && <Badge variant="outline" className="text-xs border-zastras-pink text-zastras-pink px-1.5">🎂</Badge>}
        </div>
      </div>

      {cliente.nomeCrianca && (
        <p className="text-sm text-muted-foreground">
          👦 {cliente.nomeCrianca}
          {cliente.dataNascimentoCrianca && ` - ${calcularIdade(cliente.dataNascimentoCrianca)} anos`}
        </p>
      )}

      {dias !== null && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" />
          Último contato: {dias === 0 ? 'hoje' : `${dias} dias`}
        </p>
      )}

      <div className="flex gap-2 pt-1">
        <Button variant="outline" size="sm" className="flex-1 text-xs h-8" onClick={onDetail}>
          <Eye className="w-3 h-3 mr-1" /> Detalhes
        </Button>
        {!cliente.nomeCrianca && (
          <Button size="sm" className="flex-1 text-xs h-8 gradient-zastras text-primary-foreground" onClick={onRegisterChild}>
            <UserPlus className="w-3 h-3 mr-1" /> Criança
          </Button>
        )}
      </div>
    </div>
    <WhatsAppMessagePicker
      cliente={cliente}
      open={showWhatsApp}
      onClose={() => setShowWhatsApp(false)}
      onSent={onRegistrarContato}
    />
    </>
  );
};

export default ClientCard;
