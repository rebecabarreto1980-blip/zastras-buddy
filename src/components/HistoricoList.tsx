import React from 'react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { HistoricoContato } from '@/lib/types';
import { useMarcarRespondido } from '@/hooks/useHistorico';

interface Props {
  historicos: HistoricoContato[];
  compact?: boolean;
}

const HistoricoList: React.FC<Props> = ({ historicos, compact }) => {
  const marcar = useMarcarRespondido();

  if (historicos.length === 0) {
    return <p className="text-xs text-muted-foreground">Nenhum contato registrado</p>;
  }

  return (
    <ul className="space-y-2">
      {historicos.map(h => (
        <li key={h.id} className="bg-card rounded-lg p-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-foreground">
              {format(new Date(h.dataContato), 'dd/MM/yyyy')} · {h.tipoContato}
            </p>
            {!compact && h.mensagemEnviada && (
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-3">{h.mensagemEnviada}</p>
            )}
          </div>
          <div className="shrink-0">
            {h.respondeu ? (
              <Badge variant="outline" className="text-xs border-success text-success">✅ Respondeu</Badge>
            ) : (
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] px-2"
                disabled={marcar.isPending}
                onClick={() => marcar.mutate(h.id)}
              >
                Marcar como respondido
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default HistoricoList;
