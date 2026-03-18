import {TextInput, TextInputProps} from 'react-native';

interface Props extends TextInputProps {
  className?: string;
}

export function ThemedTextInput({className, ...restProps}: Props) {
  return (
    <TextInput
      className={[
        'py-2 px-2 text-light-text dark:text-dark-text',
        className,
      ].join(' ')}
      placeholderTextColor="#888" // Un color gris neutro por defecto
      {...restProps}
    />
  );
}
