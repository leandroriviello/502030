# Módulo 1 · Capa de Datos (Dexie + IndexedDB)

Este módulo define la base técnica para almacenar información financiera en el navegador utilizando **Dexie.js** sobre IndexedDB, manteniendo TypeScript estricto.

## Objetivos

- Modelar entidades clave: ingresos, gastos, fondos, tarjetas, suscripciones y reportes.
- Exponer un wrapper `FinanceDatabase` con Dexie para operaciones CRUD tipadas.
- Facilitar la sincronización con la tienda global basada en Zustand mediante helpers reutilizables.

## Componentes principales

- `src/lib/types.ts`  
  Define los tipos de dominio (`IncomeEntity`, `ExpenseEntity`, `FundEntity`, `CardEntity`, `SubscriptionEntity`, `ReportSnapshot`) y la interfaz `FinanceEntityMap`.

- `src/lib/db.ts`  
  Implementa `FinanceDatabase` (Dexie) y helpers (`upsertRecord`, `getAllRecords`, `deleteRecord`, `clearStore`).

- `src/lib/calculations.ts`  
  Expone cálculos de resumen mensual y distribución 50/20/30 para el dashboard.

- `src/lib/notifications.ts`  
  Contiene funciones para solicitar permiso y disparar notificaciones locales desde el Service Worker.

## Próximos pasos sugeridos

- Ampliar los cálculos con proyecciones históricas y KPIs mensuales.
- Registrar seeds de ejemplo para las distintas tablas y acelerar la demo del dashboard.
- Sincronizar Dexie con un backend (Supabase o Firebase) cuando se implemente multiusuario.
