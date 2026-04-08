import {cn} from '@/src/lib/utils';
import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {Platform, Pressable, Switch, SwitchProps, View} from 'react-native';
import {ThemedText} from './ThemedText';

export interface ThemedSwitchProps extends SwitchProps {
  label?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'success';
  className?: string;
  lightColor?: string;
  darkColor?: string;
}

const isAndroid = Platform.OS === 'android';

/**
 * ThemedSwitch es una combinación de un Label y un Switch nativo,
 * adaptado a la estética de TruckPadDeck.
 */
export function ThemedSwitch({
  label,
  value,
  onValueChange,
  variant = 'secondary',
  className,
  style,
  lightColor,
  darkColor,
  ...restProps
}: ThemedSwitchProps) {
  // Obtenemos el color activo del motor de temas
  const activeColor = useThemeColor({light: lightColor, dark: darkColor}, variant as any);
  const trackColorFalse = useThemeColor({}, 'border');
  const thumbColor = isAndroid ? activeColor : undefined;

  return (
    <Pressable
      className={cn(
        'flex-row items-center justify-between p-2 active:opacity-80',
        className
      )}
      onPress={() => onValueChange?.(!value)}
      style={style}
    >
      {label ? (
        <ThemedText type="semibold" className="flex-1 mr-4">
          {label}
        </ThemedText>
      ) : (
        <View className="flex-1" />
      )}
      
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={thumbColor}
        trackColor={{false: trackColorFalse, true: activeColor}}
        {...restProps}
      />
    </Pressable>
  );
}
