import {Text, TextProps} from 'react-native';

// Tipos
type TextType =
  | 'title'
  | 'subtitle'
  | 'body'
  | 'caption'
  | 'bold'
  | 'semibold'
  | 'light'
  | 'link'
  | 'logo'
  | 'button'
  | 'data';

// Interface
interface Props extends TextProps {
  className?: string;
  type?: TextType;
}

const typeClasses: Record<TextType, string> = {
  // ---ESTRUCTURA---
  title: 'font-road text-2xl font-bold uppercase tracking-wide',
  subtitle: 'font-sans sans-bold text-lg font-semibold',
  body: 'font-sans text-base font-normal',
  caption: 'font-sans text-xs text-light-muted dark:text-dark-muted',

  // ---
  bold: 'font-sans font-bold',
  semibold: 'opacity-60 text-xs font-bold uppercase tracking-widest',
  light: 'font-sans  font-light',
  link: 'font-sans text-base underline text-light-accent dark:text-dark-accent',

  // ---ESPECIALES TRUCK---
  logo: 'font-logo text-4xl',
  button: 'font-road text-lg uppercase font-medium',
  data: 'font-gauge text-xl',
};

export function ThemedText({type = 'body', className, ...restProps}: Props) {
  return (
    <Text
      className={[
        'text-light-text dark:text-dark-text',
        typeClasses[type],
        className,
      ].join(' ')}
      {...restProps}
    />
  );
}
