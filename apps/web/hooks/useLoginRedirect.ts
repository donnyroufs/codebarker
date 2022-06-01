import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useModal } from './useModal';

export function useRedirectLogin(): void {
  const router = useRouter();
  const { onOpen } = useModal();

  useEffect(() => {
    if (!router.query.redirect) return;

    onOpen();

    router.replace(router.pathname, undefined, {
      shallow: true,
    });
  }, [router.query, onOpen, router]);
}
