import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { getContext } from 'next-rpc/context';

export async function withSession<TOutput>(
  cb: (session: Session) => Promise<TOutput>
): ReturnType<typeof cb> {
  const session = (await getSession(getContext())) as Session;

  return cb(session);
}
