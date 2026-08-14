import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const CORES: Record<string, string> = {
  Elite: 'bg-emerald-700 text-white border-transparent',
  VIP: 'bg-blue-600 text-white border-transparent',
  Fiel: 'bg-yellow-400 text-yellow-950 border-transparent',
  Ocasional: 'bg-muted text-muted-foreground border-transparent',
  Esporadico: 'bg-red-200 text-red-900 border-transparent',
  'Esporádico': 'bg-red-200 text-red-900 border-transparent',
};

export const SEGMENTOS = ['Elite', 'VIP', 'Fiel', 'Ocasional', 'Esporadico'];

const SegmentoBadge: React.FC<{ segmento?: string; className?: string }> = ({ segmento, className }) => {
  if (!segmento) return null;
  return (
    <Badge className={cn('text-xs font-semibold', CORES[segmento] ?? 'bg-muted text-muted-foreground border-transparent', className)}>
      {segmento}
    </Badge>
  );
};

export default SegmentoBadge;
