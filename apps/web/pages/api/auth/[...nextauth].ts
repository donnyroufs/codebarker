import NextAuth, { Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';

import { PrismaService } from '@codebarker/infrastructure';

import { container } from '../../../container';

export default NextAuth({
  adapter: PrismaAdapter(container.get(PrismaService)),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }): Promise<Session> {
      if (!session.user) return session;

      session.user.role = user.role;
      session.user.id = user.id;

      return session;
    },
  },
});
