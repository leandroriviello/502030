import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-8">
        <div className="text-center mb-8">
          <Link href="/" className="text-3xl font-bold text-white hover:text-white/80 transition-colors">
            502030
          </Link>
          <p className="text-white/60 mt-2">Iniciar Sesión</p>
        </div>

        <form className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-white/80 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="tu@email.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white/80 mb-2">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Iniciar Sesión
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-white/60">
            ¿No tienes cuenta?{' '}
            <Link href="/register" className="text-blue-400 hover:text-blue-300 transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link 
            href="/"
            className="text-white/60 hover:text-white/80 transition-colors text-sm"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
