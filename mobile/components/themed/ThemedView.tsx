import React from 'react';
import {View, ViewProps} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

interface Props extends ViewProps {
  className?: string;
  safe?: boolean;
}

export function ThemedView({
  className,
  safe = false,
  children,
  style,
  ...restProps
}: Props) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={[
        'flex-1 bg-light-background dark:bg-dark-background',
        className,
      ].join(' ')}
      style={[safe ? {paddingTop: insets.top} : undefined, style]}
      {...restProps}
    >
      {children}
    </View>
  );
}
