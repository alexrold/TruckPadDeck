import { useThemeColor } from '@/hooks/themed/useThemeColor';
import React from 'react';
import { View, type ViewProps } from 'react-native';

export type ThemedCardProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
  className?: string;
};

export function ThemedCard({
  style,
  lightColor,
  darkColor,
  className,
  ...otherProps
}: ThemedCardProps) {
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    'background'
  );

  return (
    <View
      style={[{ backgroundColor }, style]}
      className={`rounded-[32px] p-6 border border-black/5 dark:border-white/[0.08] shadow-sm dark:bg-[#1C2833] ${className}`}
      {...otherProps}
    />
  );
}
