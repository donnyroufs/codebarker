import 'reflect-metadata';
import '../global.css';

import { AppProps } from 'next/app';
import type { NextPage } from 'next';
import Head from 'next/head';
import { ChakraProvider } from '@chakra-ui/react';
import React from 'react';
import { QueryClient, QueryClientProvider, setLogger } from 'react-query';
import { SessionProvider } from 'next-auth/react';

import { theme } from '@codebarker/components';

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

function CustomApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppPropsWithLayout): JSX.Element {
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

  // https://github.com/nextauthjs/react-query
  // TODO: Add env
  return (
    <SessionProvider session={session}>
      <Head>
        <title>Codebarker</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <main className="app">
          <ChakraProvider theme={theme} resetCSS={true}>
            {getLayout(<Component {...pageProps} />)}
          </ChakraProvider>
        </main>
      </QueryClientProvider>
    </SessionProvider>
  );
}

export default CustomApp;
