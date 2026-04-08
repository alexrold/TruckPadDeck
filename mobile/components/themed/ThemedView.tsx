import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {cn} from '@/src/lib/utils';
import React from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type ViewVariant = 'default' | 'card' | 'secondary' | 'transparent';

export interface ThemedViewProps extends ViewProps {
  variant?: ViewVariant;
  safe?: boolean;
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedView({
  variant = 'default',
  safe = false,
  className,
  children,
  style,
  lightColor,
  darkColor,
  ...restProps
}: ThemedViewProps) {
  const insets = useSafeAreaInsets();

  // Mapeamos la variante al nombre del color en constants/Colors.ts
  let colorName: any = 'background';
  if (variant === 'card') colorName = 'card';
  if (variant === 'secondary') colorName = 'secondary';

  // Obtenemos el color real (hexadecimal) basándonos en el tema actual
  const backgroundColor =
    variant !== 'transparent'
      ? useThemeColor({light: lightColor, dark: darkColor}, colorName)
      : 'transparent';

  // Obtener el color de borde oficial para variantes que lo requieran (como 'card')
  const borderColor = useThemeColor({light: lightColor, dark: darkColor}, 'border');

  return (
    <View
      className={cn(className)}
      style={[
        {backgroundColor},
        variant === 'card' ? {borderColor, borderWidth: 1} : undefined,
        safe ? {paddingTop: insets.top} : undefined,
        style,
      ]}
      {...restProps}
    >
      {children}
    </View>
  );
}
