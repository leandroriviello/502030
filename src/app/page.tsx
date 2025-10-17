import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md mx-auto p-8 bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">
          502030
        </h1>
        <p className="text-white/80 mb-8">
          Finanzas personales - Regla 50/20/30
        </p>
        <div className="space-y-4">
          <Link 
            href="/login"
            className="w-full bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-white/90 transition-colors block"
          >
            Iniciar Sesión
          </Link>
          <Link 
            href="/register"
            className="w-full bg-white/20 text-white py-3 px-6 rounded-lg font-semibold hover:bg-white/30 transition-colors border border-white/30 block"
          >
            Registrarse
          </Link>
        </div>
        <div className="mt-8 text-sm text-white/60">
          <p>✅ Aplicación funcionando correctamente</p>
          <p>✅ Next.js 14 configurado</p>
          <p>✅ Tailwind CSS activo</p>
        </div>
      </div>
    </div>
  );
}