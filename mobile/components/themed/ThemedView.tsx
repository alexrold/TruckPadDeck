import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {View as DefaultView} from 'react-native';

type ThemeProps = {lightColor?: string; darkColor?: string};
export type ViewProps = ThemeProps & DefaultView['props'];

export function ThemedView(props: ViewProps) {
  const {style, lightColor, darkColor, ...otherProps} = props;
  const backgroundColor = useThemeColor(
    {light: lightColor, dark: darkColor},
    'background',
  );
  return <DefaultView style={[{backgroundColor}, style]} {...otherProps} />;
}
