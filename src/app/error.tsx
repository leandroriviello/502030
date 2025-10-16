'use client';

import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center liquid-glass-bg">
      <div className="max-w-md mx-auto p-6 glass-card-elevated text-center">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">
          Error de Aplicación
        </h1>
        <p className="text-foreground-secondary mb-6">
          Ha ocurrido un error inesperado. Esto puede deberse a:
        </p>
        <ul className="text-sm text-foreground-tertiary text-left mb-6 space-y-2">
          <li>• Variables de entorno faltantes (DATABASE_URL, AUTH_SECRET, NEXTAUTH_URL)</li>
          <li>• Problemas de conexión a la base de datos</li>
          <li>• Configuración incorrecta de NextAuth</li>
          <li>• Errores de JavaScript en el navegador</li>
        </ul>
        <div className="space-y-3">
          <button
            onClick={reset}
            className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 w-full"
          >
            Reintentar
          </button>
          <button
            onClick={() => window.location.href = '/'}
            className="glass-button px-6 py-3 rounded-apple w-full"
          >
            Ir al inicio
          </button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm text-foreground-secondary">
              Detalles del error (desarrollo)
            </summary>
            <pre className="mt-2 text-xs text-foreground-tertiary bg-black/20 p-3 rounded-apple overflow-auto">
              {error.message}
              {error.stack}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
