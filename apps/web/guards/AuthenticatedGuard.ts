import { getSession } from 'next-auth/react';
import { User } from 'next-auth';
import { GetServerSidePropsContext } from 'next';

type Props = {
  props: {
    user?: User;
  };
};

export class AuthenticatedGuard {
  public static async execute(
    ctx: GetServerSidePropsContext,
    redirect = '/'
  ): Promise<Props> {
    const session = await getSession({ req: ctx.req });

    if (!session?.user) {
      ctx.res.writeHead(302, { location: redirect });
      ctx.res.end();

      return {
        props: {},
      };
    }

    return {
      props: {
        user: session.user!,
      },
    };
  }
}
