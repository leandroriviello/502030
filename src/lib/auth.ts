import { PrismaAdapter } from '@auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24 * 30 // 30 días
  },
  jwt: {
    maxAge: 60 * 60 * 24 * 30
  },
  secret: process.env.AUTH_SECRET || 'fallback-secret-for-development',
  providers: [
    CredentialsProvider({
      name: 'Credenciales',
      credentials: {
        login: { label: 'Email o usuario', type: 'text', placeholder: 'tu@email.com' },
        password: { label: 'Contraseña', type: 'password' }
      },
      async authorize(credentials) {
        const login = credentials?.login?.trim();
        const password = credentials?.password;

        if (!login || !password) {
          return null;
        }

        const normalizedLogin = login.toLowerCase();

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: normalizedLogin },
              { username: normalizedLogin }
            ]
          }
        });

        if (!user) {
          return null;
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          username: user.username
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.name = user.name ?? token.name;
        token.email = user.email ?? token.email;
      } else if (!token.username && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { id: true, username: true, name: true, email: true }
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.username = dbUser.username;
          token.name = dbUser.name ?? token.name;
          token.email = dbUser.email ?? token.email;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.id === 'string' ? token.id : '';
        session.user.username = typeof token.username === 'string' ? token.username : session.user.username;
        session.user.name = token.name ?? session.user.name ?? undefined;
        session.user.email = token.email ?? session.user.email ?? undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
