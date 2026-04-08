import React from 'react';
import {ThemedView} from './ThemedView';
import {ThemedText} from './ThemedText';
import {ThemedIcon} from './ThemedIcon';
import {cn} from '@/src/lib/utils';

interface ThemedInfoItemProps {
  icon: string;
  label: string;
  value: string;
  isStatus?: boolean;
  statusCondition?: boolean;
  className?: string;
  valueClassName?: string;
}

/**
 * ThemedInfoItem - Componente atómico de información estructurada.
 * Representa un par Icono + Etiqueta + Valor con diseño consistente.
 * 
 * Ideal para fichas técnicas, perfiles de usuario y paneles de estado.
 */
export const ThemedInfoItem = ({
  icon,
  label,
  value,
  isStatus = false,
  statusCondition = false,
  className,
  valueClassName,
}: ThemedInfoItemProps) => {
  return (
    <ThemedView 
      variant="transparent" 
      className={cn("w-1/2 flex-row items-center mb-8 pr-4", className)}
    >
      <ThemedIcon name={icon as any} size={24} variant="primary" className="mr-4" />
      <ThemedView variant="transparent">
        <ThemedText variant="muted" type="caption" className="uppercase font-bold tracking-widest">
          {label}
        </ThemedText>
        <ThemedText 
          type="defaultSemiBold" 
          className={cn(
            "text-lg",
            isStatus ? (statusCondition ? 'text-green-500' : 'text-orange-500') : '',
            valueClassName
          )}
        >
          {value}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
};
