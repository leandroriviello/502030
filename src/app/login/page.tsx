import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { LoginForm } from './LoginForm';
import { GlassCard } from '@/components/GlassCard';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Iniciar sesión · 502030'
};

interface LoginPageProps {
  searchParams?: {
    callbackUrl?: string;
    error?: string;
  };
}

export default async function LoginPage({ searchParams }: LoginPageProps): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  const callbackUrl = searchParams?.callbackUrl ?? '/dashboard';
  const error = searchParams?.error ?? null;

  return (
    <div className="flex min-h-screen items-center justify-center bg-liquid-glass px-4 py-12">
      <GlassCard className="glass-card-elevated w-full max-w-md px-8 py-10 text-center">
        <div className="mb-8">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-display font-semibold">
            Bienvenido de vuelta
          </p>
          <h1 className="mt-3 text-3xl font-display font-bold text-foreground">Accedé a 502030</h1>
          <p className="mt-2 text-sm text-foreground-secondary">
            Gestiona tus finanzas personales y vuelve a tus tableros en segundos.
          </p>
        </div>
        <LoginForm callbackUrl={callbackUrl} initialError={error} />
        <p className="mt-6 text-sm text-foreground-tertiary">
          ¿No tenés una cuenta?{' '}
          <Link href="/register" className="text-foreground hover:text-foreground-secondary underline">
            Registrate gratis
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
