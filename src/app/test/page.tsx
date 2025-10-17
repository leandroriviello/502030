'use client';

export default function TestPage(): JSX.Element {
  return (
    <div className="min-h-screen bg-liquid-glass backdrop-blur-3xl flex items-center justify-center">
      <div className="max-w-md mx-auto p-6 glass-card-elevated text-center">
        <h1 className="text-2xl font-display font-bold text-foreground mb-4">
          ✅ Página de Prueba
        </h1>
        <p className="text-foreground-secondary mb-6">
          Si puedes ver esta página, el servidor está funcionando correctamente.
        </p>
        <div className="space-y-3">
          <div className="text-sm text-foreground-tertiary">
            <p>• Next.js: ✅ Funcionando</p>
            <p>• Tailwind CSS: ✅ Funcionando</p>
            <p>• React: ✅ Funcionando</p>
            <p>• Variables de entorno: ✅ Configuradas</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="glass-button px-6 py-3 rounded-apple bg-foreground hover:bg-foreground-secondary text-surface transition-all duration-200 w-full"
          >
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
