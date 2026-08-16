import React from 'react';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

const PausarContatoBadge: React.FC<{ className?: string }> = ({ className }) => (
  <Badge className={cn('text-xs font-semibold bg-warning text-warning-foreground border-transparent gap-1', className)}>
    <AlertTriangle className="w-3 h-3" /> Considerar pausar contato
  </Badge>
);

export default PausarContatoBadge;
