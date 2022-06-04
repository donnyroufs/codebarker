import { Box, BoxProps } from '@chakra-ui/react';

type Props = React.PropsWithChildren<{
  htmlFor: string;
  _styles?: BoxProps;
}>;

export const Label = ({ htmlFor, children, _styles }: Props): JSX.Element => {
  return (
    <Box as="label" htmlFor={htmlFor} fontWeight="bold" {..._styles}>
      {children}
    </Box>
  );
};
