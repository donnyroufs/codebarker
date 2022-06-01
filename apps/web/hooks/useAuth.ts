import { User } from 'next-auth';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

type UseAuthReturnValue = {
  isLoading: boolean;
  isSignedIn: boolean;
  user?: User;
};

type Props = {
  /**
   * @default false
   */
  required?: boolean;
};

export const useAuth = (props?: Props): UseAuthReturnValue => {
  const router = useRouter();

  const required = props?.required ?? true;

  const session = useSession({
    required,
    onUnauthenticated(): void {
      router.push('/');
    },
  });

  return {
    isLoading: session.status === 'loading',
    isSignedIn: session.status === 'authenticated',
    user: session.data?.user,
  };
};
