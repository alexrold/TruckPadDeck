import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {cn} from '@/src/lib/utils';
import {Text, TextProps} from 'react-native';

export type TextType =
  | 'heroTitle'
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'bold'
  | 'semibold'
  | 'defaultSemiBold'
  | 'light'
  | 'link'
  | 'logo'
  | 'button'
  | 'data';

export type TextVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'muted'
  | 'error'
  | 'success'
  | 'warning';

export interface ThemedTextProps extends TextProps {
  type?: TextType;
  variant?: TextVariant;
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

const typeClasses: Record<TextType, string> = {
  heroTitle: 'font-road text-4xl font-bold uppercase tracking-tight',
  title: 'font-road text-2xl font-bold uppercase tracking-wide',
  subtitle: 'font-sans sans-bold text-lg font-semibold',
  body: 'font-sans text-base font-normal',
  caption: 'font-sans text-xs',
  bold: 'font-sans font-bold',
  semibold: 'text-xs font-bold uppercase tracking-widest opacity-60',
  defaultSemiBold: 'font-sans text-lg font-semibold',
  light: 'font-sans font-light',
  link: 'font-sans text-base underline',
  logo: 'font-logo text-4xl',
  button: 'font-road text-lg uppercase font-medium',
  data: 'font-gauge text-xl',
};

export function ThemedText({
  type = 'body',
  variant = 'default',
  className,
  style,
  lightColor,
  darkColor,
  ...restProps
}: ThemedTextProps) {
  // Mapeamos la variante al nombre del color en constants/Colors.ts
  // Si la variante es 'default', usamos 'text', sino el nombre de la variante.
  const colorName = variant === 'default' ? 'text' : variant;

  // Obtenemos el hexadecimal real (React Native prefiere colores en 'style' para temas dinámicos rápidos)
  const textColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    colorName as any,
  );

  return (
    <Text
      className={cn(typeClasses[type], className)}
      style={[{color: textColor}, style]}
      {...restProps}
    />
  );
}
