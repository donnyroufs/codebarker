import { ChakraProps, Textarea } from '@chakra-ui/react';
import { Label } from './Label';

type Props = React.PropsWithChildren<{
  name: string;
  value: string;
  onChange: any;
  _styles?: ChakraProps;
  labelName: string | JSX.Element;
}>;

export const LabeledTextArea = ({
  labelName,
  name,
  value,
  onChange,
  _styles,
}: Props): JSX.Element => {
  return (
    <Label
      htmlFor={name}
      _styles={{
        w: 'full',
      }}
    >
      {labelName}
      <Textarea
        mt={2}
        bgColor="brand.700"
        borderColor="brand.border"
        w="full"
        resize="none"
        _hover={{
          bgColor: 'brand.700',
          borderColor: 'brand.headerShade',
        }}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        {..._styles}
      />
    </Label>
  );
};
