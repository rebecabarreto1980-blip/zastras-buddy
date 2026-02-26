import React from 'react';
import { Cliente } from '@/lib/types';
import { getWhatsAppLink, getMensagem1, getMensagem2, getMensagem3, getMensagem4 } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MessageCircle, Gift, ShoppingBag, Sparkles, Baby } from 'lucide-react';

interface Props {
  cliente: Cliente;
  open: boolean;
  onClose: () => void;
  onSent: () => void;
}

const WhatsAppMessagePicker: React.FC<Props> = ({ cliente, open, onClose, onSent }) => {
  const options = [
    {
      label: '🛍️ Obrigada pela compra',
      description: 'Agradecimento pós-compra + Instagram',
      icon: ShoppingBag,
      getMessage: () => getMensagem1(cliente.nomeCliente),
    },
    {
      label: '🎁 Pedir dados da criança',
      description: 'Coleta nome/aniversário + cupom 10%',
      icon: Baby,
      getMessage: () => getMensagem2(cliente.nomeCliente),
    },
    ...(cliente.nomeCrianca
      ? [
          {
            label: '🎂 Feliz aniversário',
            description: `Parabéns para ${cliente.nomeCrianca}`,
            icon: Gift,
            getMessage: () => getMensagem3(cliente.nomeCliente, cliente.nomeCrianca!),
          },
          {
            label: '🎉 Dia das Crianças',
            description: `Novidades para ${cliente.nomeCrianca}`,
            icon: Sparkles,
            getMessage: () => getMensagem4(cliente.nomeCliente, cliente.nomeCrianca),
          },
        ]
      : [
          {
            label: '🎉 Dia das Crianças',
            description: 'Seleções especiais de brinquedos',
            icon: Sparkles,
            getMessage: () => getMensagem4(cliente.nomeCliente),
          },
        ]),
  ];

  const handleSelect = (getMessage: () => string) => {
    const msg = getMessage();
    const link = getWhatsAppLink(cliente.telefone, msg);
    window.open(link, '_blank');
    onSent();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-success" />
            Enviar WhatsApp
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Para: <span className="font-semibold text-foreground">{cliente.nomeCliente}</span>
        </p>
        <div className="space-y-2">
          {options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(opt.getMessage)}
              className="w-full text-left bg-muted/50 hover:bg-muted rounded-xl p-3 flex items-center gap-3 transition-colors border border-transparent hover:border-primary/20"
            >
              <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <opt.icon className="w-5 h-5 text-success" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-sm text-foreground">{opt.label}</p>
                <p className="text-xs text-muted-foreground truncate">{opt.description}</p>
              </div>
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhatsAppMessagePicker;
