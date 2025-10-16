// Verificación de variables de entorno críticas
export function checkRequiredEnvVars() {
  const required = ['AUTH_SECRET', 'NEXTAUTH_URL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Variables de entorno faltantes:', missing);
    console.error('Por favor configura estas variables en Railway:');
    missing.forEach(key => {
      console.error(`  - ${key}`);
    });
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  
  console.log('✅ Variables de entorno verificadas correctamente');
}

// Verificar al importar
if (process.env.NODE_ENV === 'production') {
  checkRequiredEnvVars();
}
