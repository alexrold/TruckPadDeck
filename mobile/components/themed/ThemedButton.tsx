import {Pressable, PressableProps} from 'react-native';
import {ThemedText} from './ThemedText';

interface Props extends PressableProps {
  className?: string;
  children: string;
}

export function ThemedButton({className, children, ...rest}: Props) {
  return (
    <Pressable
      className={[
        'bg-light-primary dark:bg-dark-primary items-center justify-center rounded-xl px-6 py-3 active:opacity-80',
        className,
      ].join(' ')}
      {...rest}
    >
      <ThemedText className="text-white text-xl font-bold">
        {children}
      </ThemedText>
    </Pressable>
  );
}
