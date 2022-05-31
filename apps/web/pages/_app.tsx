import 'reflect-metadata';
import '../global.css';

import { AppProps } from 'next/app';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';

import { theme } from '@codebarker/components';
import React from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: JSX.Element) => JSX.Element;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

setLogger({
  error: () => void 0,
  log: console.log,
  warn: console.warn,
});

function CustomApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {
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
  const getLayout =
    Component.getLayout ?? ((page: JSX.Element): JSX.Element => page);

  return (
    <>
      <Head>
        <title>Codebarker</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <main className="app">
          <ChakraProvider theme={theme}>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </main>
      </QueryClientProvider>
    </>
  );
}

export default CustomApp;
