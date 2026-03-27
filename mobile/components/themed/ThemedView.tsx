import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {cn} from '@/src/lib/utils';
import React from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

export type ViewVariant = 'default' | 'card' | 'transparent';

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
  const colorName = variant === 'card' ? 'card' : 'background';

  // Obtenemos el color real (hexadecimal) basándonos en el tema actual
  const backgroundColor =
    variant !== 'transparent'
      ? useThemeColor({light: lightColor, dark: darkColor}, colorName as any)
      : 'transparent';

  return (
    <View
      className={cn(className)}
      style={[
        {backgroundColor},
        safe ? {paddingTop: insets.top} : undefined,
        style,
      ]}
      {...restProps}
    >
      {children}
    </View>
  );
}
