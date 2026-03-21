import {ReactNode} from 'react';
import {Pressable, PressableProps} from 'react-native';
import {ThemedText} from './ThemedText';

interface Props extends PressableProps {
  className?: string;
  children: ReactNode;
}

export function ThemedButton({className, children, ...rest}: Props) {
  return (
    <Pressable
      className={[
        'items-center justify-center rounded-xl px-6 py-3 active:opacity-80',
        className,
      ].join(' ')}
      {...rest}
    >
      {typeof children === 'string' ? (
        <ThemedText className="text-white text-xl font-bold">
          {children}
        </ThemedText>
      ) : (
        children
      )}
    </Pressable>
  );
}
