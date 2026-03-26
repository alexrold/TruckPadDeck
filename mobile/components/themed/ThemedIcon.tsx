import {cn} from '@/src/lib/utils';
import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {Ionicons} from '@expo/vector-icons';
import React, {ComponentProps} from 'react';

export type IconVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'error'
  | 'success'
  | 'warning';

export interface ThemedIconProps extends ComponentProps<typeof Ionicons> {
  variant?: IconVariant;
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedIcon({
  variant = 'default',
  className,
  size = 24,
  lightColor,
  darkColor,
  color: manualColor,
  ...restProps
}: ThemedIconProps) {
  // Mapeamos la variante al nombre del color en constants/Colors.ts
  const colorName = variant === 'default' ? 'text' : variant;
  
  // Obtenemos el hexadecimal real (React Native)
  const iconColor = useThemeColor({light: lightColor, dark: darkColor}, colorName as any);

  return (
    <Ionicons
      size={size}
      color={manualColor || iconColor}
      className={cn(className)}
      {...restProps}
    />
  );
}
