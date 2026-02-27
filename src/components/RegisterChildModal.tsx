import React, { useState } from 'react';
import { Cliente } from '@/lib/types';
import { useUpdateCliente } from '@/hooks/useClientes';
import { gerarCupom, getWhatsAppLink, getMensagem5 } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Gift } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Props {
  cliente: Cliente;
  onClose: () => void;
  onSaved: () => void;
}

const RegisterChildModal: React.FC<Props> = ({ cliente, onClose, onSaved }) => {
  const [nomeCrianca, setNomeCrianca] = useState(cliente.nomeCrianca || '');
  const [dataNascimento, setDataNascimento] = useState<Date | undefined>(
    cliente.dataNascimentoCrianca ? new Date(cliente.dataNascimentoCrianca) : undefined
  );
  const updateCliente = useUpdateCliente();

  const handleSave = async () => {
    if (!nomeCrianca.trim() || !dataNascimento) return;
    const cupom = gerarCupom(nomeCrianca);
    const dataStr = dataNascimento.toISOString().split('T')[0];

    await updateCliente.mutateAsync({
      id: cliente.id,
      data: {
        nomeCrianca: nomeCrianca.trim(),
        dataNascimentoCrianca: dataStr,
        cupom10Enviado: true,
        dataCupom: new Date().toISOString().split('T')[0],
        codigoCupom: cupom,
      },
    });

    const msg = getMensagem5(cliente.nomeCliente, nomeCrianca.trim(), cupom);
    window.open(getWhatsAppLink(cliente.telefone, msg), '_blank');

    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Registrar Dados da Criança</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-muted rounded-lg p-3">
            <p className="text-sm font-medium text-foreground">Cliente: {cliente.nomeCliente}</p>
            <p className="text-xs text-muted-foreground">{cliente.telefone}</p>
          </div>

          <div>
            <Label className="text-sm font-semibold">Nome da criança *</Label>
            <Input value={nomeCrianca} onChange={e => setNomeCrianca(e.target.value)} placeholder="Nome da criança" className="h-11 mt-1" />
          </div>

          <div>
            <Label className="text-sm font-semibold">Data de nascimento *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className={cn("w-full h-11 mt-1 justify-start text-left font-normal", !dataNascimento && "text-muted-foreground")}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {dataNascimento ? format(dataNascimento, "dd/MM/yyyy") : "Selecionar data"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={dataNascimento}
                  onSelect={setDataNascimento}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="bg-zastras-light-purple rounded-lg p-3 flex items-center gap-2">
            <Gift className="w-5 h-5 text-secondary" />
            <p className="text-sm text-foreground">Cupom de 10% será gerado automaticamente!</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            className="gradient-zastras text-primary-foreground"
            onClick={handleSave}
            disabled={!nomeCrianca.trim() || !dataNascimento || updateCliente.isPending}
          >
            {updateCliente.isPending ? 'Salvando...' : '✅ Confirmar e Enviar Cupom'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterChildModal;
