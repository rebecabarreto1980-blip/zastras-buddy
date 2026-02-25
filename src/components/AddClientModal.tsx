import React, { useState } from 'react';
import { addCliente } from '@/lib/store';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface Props {
  vendedorId: string;
  onClose: () => void;
  onSaved: () => void;
}

const AddClientModal: React.FC<Props> = ({ vendedorId, onClose, onSaved }) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const handleSave = () => {
    if (!nome.trim() || !telefone.trim()) return;
    addCliente({
      nomeCliente: nome.trim(),
      telefone: telefone.replace(/\D/g, ''),
      email: email.trim() || undefined,
      vendedorId,
      observacoes: observacoes.trim() || undefined,
      primeiroContatoFeito: false,
      cupom10Enviado: false,
    });
    onSaved();
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-display">Novo Cliente</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold">Nome *</Label>
            <Input value={nome} onChange={e => setNome(e.target.value)} placeholder="Nome completo" className="h-11 mt-1" />
          </div>
          <div>
            <Label className="text-sm font-semibold">Telefone *</Label>
            <Input value={telefone} onChange={e => setTelefone(e.target.value)} placeholder="(11) 99999-9999" className="h-11 mt-1" />
          </div>
          <div>
            <Label className="text-sm font-semibold">Email</Label>
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="email@exemplo.com" className="h-11 mt-1" />
          </div>
          <div>
            <Label className="text-sm font-semibold">Observações</Label>
            <Textarea value={observacoes} onChange={e => setObservacoes(e.target.value)} placeholder="Notas sobre o cliente..." className="mt-1" rows={3} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button className="gradient-zastras text-primary-foreground" onClick={handleSave} disabled={!nome.trim() || !telefone.trim()}>
            Salvar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddClientModal;
