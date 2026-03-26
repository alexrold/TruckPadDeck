import {cn} from '@/src/lib/utils';
import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {ReactNode} from 'react';
import {Pressable, PressableProps, ViewStyle} from 'react-native';
import {ThemedText} from './ThemedText';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'outline'
  | 'ghost'
  | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg' | 'icon';

export interface ThemedButtonProps extends PressableProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
  lightColor?: string;
  darkColor?: string;
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 rounded-lg',
  md: 'px-6 py-3 rounded-xl',
  lg: 'px-8 py-4 rounded-2xl',
  icon: 'p-2 rounded-full items-center justify-center',
};

export function ThemedButton({
  variant = 'ghost',
  size = 'md',
  className,
  children,
  style,
  lightColor,
  darkColor,
  ...rest
}: ThemedButtonProps) {
  // Determinamos el color de fondo basado en la variante
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    (variant === 'ghost' || variant === 'outline' ? 'transparent' : variant) as any
  );

  // Estilos de borde para la variante outline
  const borderColor = useThemeColor({}, 'border');
  const outlineStyle: ViewStyle = variant === 'outline' 
    ? { borderWidth: 1, borderColor } 
    : {};

  return (
    <Pressable
      className={cn(
        'items-center justify-center active:opacity-80',
        sizeClasses[size],
        className
      )}
      style={[
        { backgroundColor },
        outlineStyle,
        style as ViewStyle,
      ]}
      {...rest}
    >
      {typeof children === 'string' ? (
        <ThemedText
          type="button"
          // Si el botón es primario o peligro, el texto suele ser blanco/claro
          // Si es ghost/outline, usamos el color primario del tema
          variant={variant === 'primary' || variant === 'danger' ? 'default' : 'primary'}
          className={cn(
            (variant === 'primary' || variant === 'danger') ? 'text-white' : ''
          )}
        >
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </Pressable>
  );
}
