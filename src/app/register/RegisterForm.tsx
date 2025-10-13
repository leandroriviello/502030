'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface RegisterFormProps {
  callbackUrl?: string;
}

export function RegisterForm({ callbackUrl = '/dashboard' }: RegisterFormProps): JSX.Element {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
    confirm: ''
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (form.password !== form.confirm) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    setError(null);

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: form.name.trim(),
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password
      })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      setError(data?.error ?? 'No pudimos crear tu cuenta. Intenta nuevamente.');
      setLoading(false);
      return;
    }

    const signInResult = await signIn('credentials', {
      login: form.email.trim(),
      password: form.password,
      redirect: false,
      callbackUrl
    });

    setLoading(false);

    if (signInResult?.error) {
      router.push('/login');
      return;
    }

    if (signInResult?.url) {
      router.replace(signInResult.url);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Nombre completo
        </label>
        <input
          name="name"
          type="text"
          autoComplete="name"
          value={form.name}
          onChange={handleChange}
          className="glass-input w-full rounded-apple px-4 py-3"
          placeholder="Tu nombre"
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Usuario
        </label>
        <input
          name="username"
          type="text"
          autoComplete="username"
          value={form.username}
          onChange={handleChange}
          className="glass-input w-full rounded-apple px-4 py-3"
          placeholder="usuario"
          pattern="^[a-zA-Z0-9_\\.\\-]{3,}$"
          title="Al menos 3 caracteres. Solo letras, números, puntos, guiones y guion bajo."
          required
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground-secondary">
          Email
        </label>
        <input
          name="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange}
          className="glass-input w-full rounded-apple px-4 py-3"
          placeholder="tu@email.com"
          required
        />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground-secondary">
            Contraseña
          </label>
          <input
            name="password"
            type="password"
            autoComplete="new-password"
            value={form.password}
            onChange={handleChange}
            className="glass-input w-full rounded-apple px-4 py-3"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-foreground-secondary">
            Repetir contraseña
          </label>
          <input
            name="confirm"
            type="password"
            autoComplete="new-password"
            value={form.confirm}
            onChange={handleChange}
            className="glass-input w-full rounded-apple px-4 py-3"
            placeholder="••••••••"
            minLength={8}
            required
          />
        </div>
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
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>
    </form>
  );
}
