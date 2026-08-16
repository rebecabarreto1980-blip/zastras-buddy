import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CORES: Record<string, string> = {
  Diamante: 'bg-segment-diamante text-segment-diamante-foreground border-transparent',
  Platina: 'bg-segment-platina text-segment-platina-foreground border-transparent',
  Ouro: 'bg-segment-ouro text-segment-ouro-foreground border-transparent',
  Prata: 'bg-segment-prata text-segment-prata-foreground border-transparent',
  Bronze: 'bg-segment-bronze text-segment-bronze-foreground border-transparent',
};

export const SEGMENTOS = ['Diamante', 'Platina', 'Ouro', 'Prata', 'Bronze'];

const SegmentoBadge: React.FC<{ segmento?: string; className?: string }> = ({ segmento, className }) => {
  if (!segmento) return null;
  return (
    <Badge className={cn('text-xs font-semibold', CORES[segmento] ?? 'bg-muted text-muted-foreground border-transparent', className)}>
      {segmento}
    </Badge>
  );
};

export default SegmentoBadge;
