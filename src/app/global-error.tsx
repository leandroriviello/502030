'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="max-w-md mx-auto p-6 bg-gray-900 rounded-lg border border-gray-700 text-center">
            <h1 className="text-2xl font-bold text-white mb-4">
              Error Crítico
            </h1>
            <p className="text-gray-300 mb-6">
              Ha ocurrido un error crítico en la aplicación. Por favor:
            </p>
            <ul className="text-sm text-gray-400 text-left mb-6 space-y-2">
              <li>• Verifica que las variables de entorno estén configuradas</li>
              <li>• Asegúrate de que la base de datos esté accesible</li>
              <li>• Revisa los logs del servidor</li>
            </ul>
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors w-full"
            >
              Reintentar
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
