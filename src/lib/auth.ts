import { PrismaAdapter } from '@auth/prisma-adapter';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24 * 30 // 30 días
  },
  secret: process.env.AUTH_SECRET,
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
    async session({ session, user }) {
      if (!session.user) {
        return session;
      }

      const baseUser =
        user ??
        (session.user.email
          ? await prisma.user.findUnique({
              where: { email: session.user.email },
              select: { id: true, username: true, name: true, email: true }
            })
          : null);

      if (baseUser) {
        session.user.id = baseUser.id;
        session.user.username = baseUser.username;
        session.user.name = baseUser.name ?? session.user.name ?? undefined;
        session.user.email = baseUser.email ?? session.user.email ?? undefined;
      } else {
        session.user.id = session.user.id ?? '';
        session.user.username = session.user.username ?? '';
      }

      return session;
    }
  },
  pages: {
    signIn: '/login'
  }
};
