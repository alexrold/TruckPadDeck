import {useThemeColor} from '@/hooks/themed/useThemeColor';
import {Platform, Pressable, Switch, View} from 'react-native';
import {ThemedText} from './ThemedText';

interface Props {
  text?: string;
  value: boolean;
  className?: string;
  onValueChange: (value: boolean) => void;
}

const isAndroid = Platform.OS === 'android';

export const ThemedSwitch = ({
  text,
  value,
  className,
  onValueChange,
}: Props) => {
  const switchActiveColor = useThemeColor({}, 'secondary');

  return (
    <Pressable
      className={[
        'flex flex-row mx-2 items-center justify-between active:opacity-80',
        className,
      ].join(' ')}
      onPress={() => onValueChange(!value)}
    >
      {text ? <ThemedText type="bold">{text}</ThemedText> : <View />}
      <Switch
        value={value}
        onValueChange={onValueChange}
        thumbColor={isAndroid ? switchActiveColor : ''}
        trackColor={{false: '#ccc', true: switchActiveColor}}
      />
    </Pressable>
  );
};
