import { Box } from '@chakra-ui/react';

type Props = {
  message: string;
};

export const ErrorMessage = ({ message }: Props): JSX.Element => (
  <Box color="red.400">{message}</Box>
);
