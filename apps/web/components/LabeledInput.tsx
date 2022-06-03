import { ChakraProps, Input } from '@chakra-ui/react';
import { HTMLInputTypeAttribute } from 'react';

import { Label } from './Label';

type Props = {
  name: string;
  value: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: any;
  _labelStyles?: ChakraProps;
  _styles?: ChakraProps;
};

export const LabeledInput = ({
  value,
  name,
  type,
  placeholder,
  _styles,
  _labelStyles,
  onChange,
}: Props): JSX.Element => {
  return (
    <Label
      htmlFor={name}
      _styles={{
        w: 'full',
        ..._labelStyles,
      }}
    >
      <Input
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
    </Label>
  );
};
