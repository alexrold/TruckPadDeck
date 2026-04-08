import {cn} from '@/src/lib/utils';
import React from 'react';
import {ThemedView, ThemedViewProps} from './ThemedView';

export interface ThemedCardProps extends ThemedViewProps {
  className?: string;
}

/**
 * ThemedCard es una especialización de ThemedView con bordes y sombras
 * optimizados para los dashboards de TruckPadDeck.
 */
export function ThemedCard({
  className,
  variant = 'card',
  children,
  ...restProps
}: ThemedCardProps) {
  return (
    <ThemedView
      variant={variant}
      className={cn(
        'rounded-[32px] p-6 border border-black/5 dark:border-white/[0.08] shadow-sm',
        className
      )}
      {...restProps}
    >
      {children}
    </ThemedView>
  );
}
