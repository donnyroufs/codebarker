import { ChakraProps, Input as ChakraInput, VStack } from '@chakra-ui/react';
import { HTMLInputTypeAttribute } from 'react';
import { ErrorMessage } from './ErrorMessage';

type Props = {
  name: string;
  value: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: any;
  _styles?: ChakraProps;
  errorMessage?: string;
};

export const Input = ({
  name,
  type,
  placeholder,
  value,
  onChange,
  _styles,
  errorMessage,
}: Props): JSX.Element => {
  return (
    <VStack w="full" alignItems="flex-start">
      <ChakraInput
        mt={2}
        type={type}
        placeholder={placeholder}
        bgColor="brand.700"
        borderColor="brand.border"
        _hover={{
          bgColor: 'brand.700',
          borderColor: 'brand.headerShade',
        }}
        value={value}
        onChange={onChange}
        name={name}
        id={name}
        {..._styles}
      />
      {errorMessage != null && <ErrorMessage message={errorMessage} />}
    </VStack>
  );
};
