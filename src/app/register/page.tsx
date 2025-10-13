import type { Metadata } from 'next';
import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { RegisterForm } from './RegisterForm';
import { GlassCard } from '@/components/GlassCard';
import { authOptions } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Crear cuenta · 502030'
};

interface RegisterPageProps {
  searchParams?: {
    callbackUrl?: string;
  };
}

export default async function RegisterPage({ searchParams }: RegisterPageProps): Promise<JSX.Element> {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  const callbackUrl = searchParams?.callbackUrl ?? '/dashboard';

  return (
    <div className="flex min-h-screen items-center justify-center bg-liquid-glass px-4 py-12">
      <GlassCard className="glass-card-elevated w-full max-w-2xl px-8 py-10">
        <div className="mb-8 text-center">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40 font-display font-semibold">
            Crear cuenta
          </p>
          <h1 className="mt-3 text-3xl font-display font-bold text-foreground">Empezá con 502030</h1>
          <p className="mt-2 text-sm text-foreground-secondary">
            Configurá tu usuario para guardar tus fondos, tarjetas y reportes de forma segura.
          </p>
        </div>
        <RegisterForm callbackUrl={callbackUrl} />
        <p className="mt-6 text-center text-sm text-foreground-tertiary">
          ¿Ya tenés una cuenta?{' '}
          <Link href="/login" className="text-foreground hover:text-foreground-secondary underline">
            Iniciar sesión
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
