import { ChakraProps } from '@chakra-ui/react';
import { HTMLInputTypeAttribute } from 'react';

import { Label } from './Label';
import { Input } from './Input';

type Props = {
  name: string;
  value: string;
  type: HTMLInputTypeAttribute;
  placeholder?: string;
  onChange: any;
  _labelStyles?: ChakraProps;
  _styles?: ChakraProps;
  labelName: string;
};

export const LabeledInput = ({
  name,
  _labelStyles,
  labelName,
  ...rest
}: Props): JSX.Element => {
  return (
    <Label
      htmlFor={name}
      _styles={{
        w: 'full',
        ..._labelStyles,
      }}
    >
      {labelName}
      <Input name={name} {...rest} />
    </Label>
  );
};
