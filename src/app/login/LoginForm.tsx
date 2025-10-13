'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  callbackUrl?: string;
  initialError?: string | null;
}

export function LoginForm({ callbackUrl = '/dashboard', initialError }: LoginFormProps): JSX.Element {
  const router = useRouter();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    setError(null);

    const response = await signIn('credentials', {
      login,
      password,
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (response?.error) {
      setError('Credenciales inválidas. Verifica tus datos.');
      return;
    }

    if (response?.url) {
      router.replace(response.url);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Email o usuario
        </label>
        <input
          type="text"
          autoComplete="username"
          value={login}
          onChange={(event) => setLogin(event.target.value)}
          className="glass-input w-full rounded-apple px-4 py-3"
          placeholder="tu@email.com"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Contraseña
        </label>
        <input
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="glass-input w-full rounded-apple px-4 py-3"
          placeholder="••••••••"
          required
        />
      </div>
      {error ? (
        <p className="rounded-apple border border-red-500/40 bg-red-500/10 px-4 py-2 text-sm text-red-200">
          {error}
        </p>
      ) : null}
      <button
        type="submit"
        disabled={loading}
        className="glass-button w-full rounded-apple bg-foreground px-4 py-3 font-display font-semibold text-surface transition hover:bg-foreground-secondary disabled:cursor-not-allowed disabled:bg-white/20 disabled:text-white/60"
      >
        {loading ? 'Ingresando...' : 'Iniciar sesión'}
      </button>
    </form>
  );
}
