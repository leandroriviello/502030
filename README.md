# 502030 · Finanzas personales

Aplicación web (Next.js 14) para gestionar un presupuesto personal siguiendo la regla 50/20/30. Incluye autenticación con usuario y contraseña, almacenamiento local con IndexedDB (Dexie) y sincronización de entidades clave como cuentas bancarias, tarjetas, suscripciones, movimientos, fondos y deudas.

## Características principales
- **Dashboard en tiempo real**: gráfico de presupuesto mensual, resumen de ingresos/gastos/balance y próximos cobros.
- **Movimientos**: registro de ingresos, egresos y transferencias (incluye botón flotante global).
- **Cuentas bancarias**: saldos por moneda, información para débitos automáticos y notas.
- **Tarjetas**: límites, consumo actual, fechas de cierre/pago y cuenta asociada.
- **Suscripciones**: proveedores populares, categorías (Streaming, IA, Videojuegos, etc.), cálculo prorrateado y link con tarjeta o cuenta.
- **Fondos**: metas de ahorro con progreso visual.
- **Deudas**: seguimiento de saldo pendiente, porcentajes abonados y cuenta de pago.
- **Reportes**: comparativa mensual de ingresos vs gastos, top de categorías y promedios.
- **Autenticación**: NextAuth (credenciales) + Prisma + PostgreSQL (Railway).
- **PWA ready**: soporte para instalación y uso tipo app.

## Stack
- [Next.js 14](https://nextjs.org/) + App Router
- [React 18](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Dexie](https://dexie.org/) (IndexedDB offline-first)
- [Prisma](https://www.prisma.io/) + PostgreSQL (Auth)
- [NextAuth](https://authjs.dev/) (credenciales)
- [Framer Motion](https://www.framer.com/motion/) (transiciones)
- [Zustand](https://zustand-demo.pmnd.rs/) (estado global)

## Requisitos
- Node.js 18+
- npm 9+ (o pnpm/yarn si prefieres)
- Una base de datos PostgreSQL (Railway recomendado)

## Puesta en marcha
```bash
# Instalar dependencias
npm install

# Configura variables de entorno (ver sección siguiente)
cp .env.example .env.local  # crea el archivo si no existe y completa valores

# Generar cliente de Prisma
npm run db:generate

# Ejecutar migraciones en la base remota/local
npx prisma migrate deploy

# Ejecutar seed opcional (crea usuario admin)
SEED_ADMIN_EMAIL="admin@ejemplo.com" \
SEED_ADMIN_USERNAME="admin" \
SEED_ADMIN_PASSWORD="cambiaEstaClave" \
npm run db:seed

# Levantar en modo desarrollo
npm run dev
```

### Variables de entorno clave
| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (usa modo `?sslmode=require` en Railway). |
| `AUTH_SECRET` | Llave para firmar JWT de NextAuth (`openssl rand -base64 32`). |
| `NEXTAUTH_URL` | URL pública de la app (`https://tuapp.railway.app`). |

_Para el seed_: `SEED_ADMIN_EMAIL`, `SEED_ADMIN_USERNAME`, `SEED_ADMIN_PASSWORD`, `SEED_ADMIN_NAME`.

### Scripts útiles
| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo (http://localhost:3000). |
| `npm run build` | Build de producción. |
| `npm run start` | Servir build (`next start`). |
| `npm run lint` | ESLint. |
| `npm run check:types` | TypeScript `--noEmit`. |
| `npm run db:generate` | `prisma generate`. |
| `npm run db:migrate` | `prisma migrate deploy`. |
| `npm run db:seed` | Ejecuta `prisma/seed.js`. |

## Base de datos y migraciones
Las tablas de autenticación y soporte (`User`, `Account`, `Session`, `VerificationToken`) están definidas en `prisma/schema.prisma`. Para aplicar el esquema:

```bash
npx prisma migrate deploy        # producción (ej. Railway)
# o en desarrollo:
npx prisma migrate dev --name init_auth
```

Si cambian modelos relacionados con Prisma, recuerda volver a ejecutar `npm run db:generate`.

## Desarrollo local
- La mayoría de los datos (movimientos, cuentas, tarjetas, etc.) se almacenan en IndexedDB mediante Dexie. Si cambias el esquema (`DATABASE_VERSION` en `lib/db.ts`), borra la base desde el DevTools del navegador para evitar inconsistencias.
- El botón flotante queda disponible en todas las vistas autenticadas y actualiza saldos de cuentas automáticamente.
- Las páginas clave están en `src/app/...`. Cada módulo tiene sus formularios y utiliza el store (`src/store/useFinanceStore.tsx`).

## Deploy en Railway (resumen)
1. Configura las variables de entorno (`DATABASE_URL`, `AUTH_SECRET`, `NEXTAUTH_URL`).
2. Ejecuta `npx prisma migrate deploy` contra la base de Railway (desde tu máquina o en shell remoto).
3. Opcional: `npm run db:seed` para crear un usuario inicial.
4. Realiza el deploy (`npm run build` / Dockerfile existente).

## Roadmap próximo
- Edición de movimientos existentes y conciliación avanzada.
- Soporte multi-moneda (conversión en reportes).
- Notificaciones / recordatorios (vencimientos y alertas de límites).
- Exportación de datos (CSV/Excel) y dashboard móvil.

---

> Cualquier mejora o bugfix es bienvenida. ¡Disfruta administrando tus finanzas con 502030!
