# 🚀 Configuración de Railway - Variables de Entorno

## ⚠️ Problema Actual
La aplicación muestra "Application error: a client-side exception has occurred" porque faltan variables de entorno críticas en Railway.

## 🔧 Solución: Configurar Variables de Entorno

### 1. Acceder a Railway Dashboard
1. Ve a [railway.app](https://railway.app)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto `502030`

### 2. Configurar Variables de Entorno
Ve a la pestaña **"Variables"** y agrega estas variables:

#### 🔑 Variables Críticas (REQUERIDAS)

```bash
# Base de datos PostgreSQL
DATABASE_URL=postgresql://postgres:password@host:port/railway?sslmode=require

# NextAuth - Genera una clave segura
AUTH_SECRET=vzRP6wCuQZekGCWLYCuCiJ2woRRz7Z1YJhjp8zCzGZg=

# URL de la aplicación
NEXTAUTH_URL=https://502030-production.up.railway.app
```

#### 📊 Variables Opcionales (API Keys)

```bash
# Para datos de criptomonedas (opcional)
NEXT_PUBLIC_CMC_API_KEY=tu-api-key-coinmarketcap

# Para datos de acciones (opcional)
NEXT_PUBLIC_ALPHA_VANTAGE_API_KEY=tu-api-key-alpha-vantage

# Para datos financieros (opcional)
NEXT_PUBLIC_FINNHUB_API_KEY=tu-api-key-finnhub
```

### 3. Generar AUTH_SECRET
Ejecuta este comando en tu terminal para generar una clave segura:

```bash
openssl rand -base64 32
```

O usa este generador online: https://generate-secret.vercel.app/32

### 4. Obtener DATABASE_URL
1. En Railway, ve a la pestaña **"Data"**
2. Si no tienes una base PostgreSQL, crea una nueva
3. Ve a **"Connect"** → **"Postgres"**
4. Copia la **"DATABASE_URL"** completa
5. Agrega `?sslmode=require` al final si no está

### 5. Configurar NEXTAUTH_URL
Usa exactamente la URL que Railway te proporciona:
```
NEXTAUTH_URL=https://502030-production.up.railway.app
```

## 🗄️ Configurar Base de Datos

### 1. Ejecutar Migraciones
Después de configurar las variables, ejecuta las migraciones:

```bash
# Desde tu máquina local (con las variables configuradas)
npx prisma migrate deploy

# O desde Railway CLI
railway run npx prisma migrate deploy
```

### 2. Crear Usuario Admin (Opcional)
```bash
# Desde tu máquina local
SEED_ADMIN_EMAIL="admin@tuapp.com" \
SEED_ADMIN_USERNAME="admin" \
SEED_ADMIN_PASSWORD="tu-password-seguro" \
SEED_ADMIN_NAME="Administrador" \
npx prisma db seed
```

## 🔄 Reiniciar Aplicación

Después de configurar las variables:
1. Ve a la pestaña **"Deployments"** en Railway
2. Haz clic en **"Redeploy"** para reiniciar la aplicación
3. Espera a que termine el despliegue

## ✅ Verificar Configuración

Una vez configurado, la aplicación debería:
- ✅ Cargar sin errores
- ✅ Mostrar la página de login
- ✅ Permitir registro de usuarios
- ✅ Funcionar todas las funcionalidades

## 🆘 Si Sigue Fallando

### Revisar Logs
1. Ve a **"Deployments"** → **"View Logs"**
2. Busca errores relacionados con:
   - `DATABASE_URL`
   - `AUTH_SECRET`
   - `NEXTAUTH_URL`

### Verificar Variables
Asegúrate de que las variables estén exactamente así:
- Sin espacios extra
- Con comillas si contienen caracteres especiales
- Con la URL completa y correcta

### Probar Localmente
```bash
# Configura las variables en .env.local
cp .env.example .env.local
# Edita .env.local con tus valores

# Ejecuta localmente
npm run dev
```

## 📞 Soporte

Si necesitas ayuda adicional:
1. Revisa los logs de Railway
2. Verifica que todas las variables estén configuradas
3. Asegúrate de que la base de datos esté accesible
4. Prueba la aplicación localmente primero
