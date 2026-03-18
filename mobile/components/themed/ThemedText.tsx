import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {Text as DefaultText} from 'react-native';

type ThemeProps = {lightColor?: string; darkColor?: string};
export type TextProps = ThemeProps & DefaultText['props'];

export function ThemedText(props: TextProps) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  const color = useThemeColor({light: lightColor, dark: darkColor}, 'text');
  return <DefaultText style={[{color}, style]} {...otherProps} />;
}
