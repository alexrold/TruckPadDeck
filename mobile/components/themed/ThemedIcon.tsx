import {Ionicons} from '@expo/vector-icons';
import {cssInterop} from 'nativewind';
import React, {ComponentProps} from 'react';

// Habilitamos Tailwind para la prop 'color'
cssInterop(Ionicons, {
  className: {
    target: 'style',
    nativeStyleToProp: {
      color: true,
    },
  },
});

interface Props extends ComponentProps<typeof Ionicons> {
  className?: string;
}

export function ThemedIcon({className, size = 24, ...restProps}: Props) {
  return <Ionicons size={size} className={className} {...restProps} />;
}
