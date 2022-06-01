// https://github.com/chakra-ui/chakra-ui/issues/4987

import { useColorMode } from '@chakra-ui/react';
import { useEffect } from 'react';

export function ForceLightMode(props: { children: JSX.Element }): JSX.Element {
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    if (colorMode === 'light') return;

    toggleColorMode();
  }, [colorMode, toggleColorMode]);

  return props.children;
}
