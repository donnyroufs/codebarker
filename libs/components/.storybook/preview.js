import { ChakraProvider } from '@chakra-ui/react';
import { addDecorator } from '@storybook/react';
import { theme } from '../src/lib/Theme';

// https://github.com/chakra-ui/chakra-ui/issues/2190#issuecomment-710344022
const customProvider = (props) => {
  return (
    <ChakraProvider resetCSS={true} theme={theme}>
      {props.children}
    </ChakraProvider>
  );
};

addDecorator(customProvider);
