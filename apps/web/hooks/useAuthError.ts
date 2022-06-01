import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export function useAuthError(): void {
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    if (!router.query.error) return;

    // TODO: Add log
    const msg = router.query.error.includes('OAuthAccountNotLinked')
      ? 'There seems to be an account with the same email already registered with another social auth provider. Try logging in with a different provider.'
      : `Something went wrong with authenticating, please contact an admin and give them this code: "${
          router.query.error ?? '#0001'
        }"`;

    toast({
      title: 'Authentication failed',
      description: msg,
      status: 'error',
      duration: 15_000,
      isClosable: true,
      position: 'bottom-right',
    });
  }, [router.query, toast]);
}
