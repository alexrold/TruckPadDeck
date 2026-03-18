import {Text, TextProps} from 'react-native';

type TextType = 'title' | 'body' | 'bold' | 'semibold' | 'light' | 'link';

interface Props extends TextProps {
  className?: string;
  type?: TextType;
}

const typeClasses: Record<string, string> = {
  title: 'text-3xl font-bold',
  body: 'font-normal',
  bold: 'font-bold',
  semibold: 'font-semibold',
  light: 'font-light',
  link: 'font-normal underline',
};

export function ThemedText({type, className, ...restProps}: Props) {
  const selectedTypeClass = type ? typeClasses[type] : '';

  return (
    <Text
      className={[
        'text-light-text dark:text-dark-text',
        selectedTypeClass,
        className,
      ].join(' ')}
      {...restProps}
    />
  );
}
