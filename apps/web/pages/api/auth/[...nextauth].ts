import NextAuth, { Session } from 'next-auth';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import GithubProvider from 'next-auth/providers/github';
import DiscordProvider from 'next-auth/providers/discord';
import GoogleProvider from 'next-auth/providers/google';

import prisma from '../../../prisma';

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_ID!,
      clientSecret: process.env.DISCORD_SECRET!,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  pages: {
    newUser: '/',
    signOut: '/',
    signIn: '/',
    verifyRequest: '/',
    error: '/',
  },
  callbacks: {
    async session({ session, user }): Promise<Session> {
      if (!session.user) return session;

      session.user.role = user.role;
      session.user.id = user.id;

      return session;
    },
  },
});
