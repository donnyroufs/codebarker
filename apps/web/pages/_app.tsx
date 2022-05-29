import 'reflect-metadata';
import '../global.css';

import { AppProps } from 'next/app';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@codebarker/components';
import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';

function CustomApp({ Component, pageProps }: AppProps): JSX.Element {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: false,
          },
        },
      }),
    []
  );

  return (
    <>
      <Head>
        <title>Codebarker</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <main className="app">
          <ChakraProvider theme={theme}>
            <Component {...pageProps} />
          </ChakraProvider>
        </main>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
