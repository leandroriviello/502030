# 🚀 Guía de Despliegue en Railway

## Archivos creados para el despliegue

1. **`next.config.js`** - Configuración de Next.js con output standalone para optimizar el despliegue
2. **`railway.json`** - Configuración específica para Railway
3. **`.gitignore`** - Para evitar subir archivos innecesarios

## Pasos para desplegar en Railway

### 1. Preparar el repositorio

Asegúrate de que todos los cambios estén confirmados:

```bash
git add .
git commit -m "Add Railway configuration files"
git push
```

### 2. Configurar en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. Haz clic en "New Project"
3. Selecciona "Deploy from GitHub repo"
4. Elige tu repositorio `502030`
5. Railway detectará automáticamente que es una aplicación Next.js

### 3. Variables de entorno (si las necesitas)

En Railway, ve a la pestaña "Variables" y agrega:

- `NODE_ENV=production` (Railway lo configura automáticamente)
- Cualquier otra variable de entorno que tu app necesite

### 4. Configuración del puerto

Railway asigna automáticamente un puerto a través de la variable `PORT`. La configuración ya está lista para usar `$PORT` en el script de inicio.

### 5. Dominio

Railway te dará un dominio automático como `tu-app.up.railway.app`. Puedes configurar un dominio personalizado en la pestaña "Settings".

## Problemas comunes resueltos

✅ **Output standalone**: Optimiza el tamaño del despliegue
✅ **Puerto dinámico**: Se adapta al puerto que Railway asigna
✅ **Hostname correcto**: `-H 0.0.0.0` permite que Railway enrute el tráfico correctamente
✅ **Sin postinstall problemático**: Se eliminó el script que podía fallar en producción

## Verificar el despliegue

Una vez desplegado, puedes verificar:

1. Los logs en la pestaña "Deployments" de Railway
2. Acceder a la URL proporcionada por Railway
3. Verificar que todas las rutas funcionen correctamente

## Notas adicionales

- Esta es una PWA (Progressive Web App), asegúrate de que el manifest y service worker funcionen correctamente
- La aplicación usa Dexie (IndexedDB) para almacenamiento local, lo cual funciona perfectamente en el navegador
- No requiere base de datos en el servidor porque todo el almacenamiento es local en el navegador

## Soporte

Si tienes problemas con el despliegue:
- Revisa los logs en Railway
- Verifica que todas las dependencias estén en `dependencies` (no en `devDependencies`) si son necesarias en producción
- Asegúrate de que el build local funcione: `npm run build && npm start`

