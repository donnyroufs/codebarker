import { useRouter } from 'next/router';

import { cast } from '@codebarker/shared';

type Props = {
  languages: string[];
  clearQueryString: () => void;
};

// https://github.com/vercel/next.js/discussions/11484#discussioncomment-60563
export function useLanguagesQueryString(): Props {
  const { isReady, query, replace, pathname } = useRouter();

  const languages =
    isReady && query.languages
      ? cast<string>(query.languages).split(',')
      : ['all'];

  function clearQueryString(): void {
    replace(pathname, undefined, {
      shallow: true,
    });
  }

  return {
    languages,
    clearQueryString,
  };
}
