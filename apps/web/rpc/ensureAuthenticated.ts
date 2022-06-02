import { WrapMethod } from 'next-rpc';
import { getSession } from 'next-auth/react';
import { getContext } from 'next-rpc/context';

export const ensureAuthenticated: WrapMethod = (method, _meta) => {
  return async (...args) => {
    const ctx = getContext();
    const session = await getSession(ctx);

    if (!session?.user) {
      // TODO: How to propogate this to the client?
      throw new Error('You are not authenticated');
    }

    return await method(...args);
  };
};
