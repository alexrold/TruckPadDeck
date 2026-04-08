import {cn} from '@/src/lib/utils';
import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {TextInput, TextInputProps, TextStyle} from 'react-native';

export interface ThemedTextInputProps extends TextInputProps {
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

export function ThemedTextInput({
  className,
  style,
  lightColor,
  darkColor,
  ...restProps
}: ThemedTextInputProps) {
  // Obtenemos el color de texto y de placeholder del tema
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text' as any);
  const placeholderColor = useThemeColor({}, 'muted' as any);

  return (
    <TextInput
      className={cn(
        'py-3 px-4 rounded-xl border border-light-border dark:border-dark-border bg-light-card/20 dark:bg-dark-card/20',
        className
      )}
      style={[{color}, style as TextStyle]}
      placeholderTextColor={placeholderColor}
      {...restProps}
    />
  );
}
