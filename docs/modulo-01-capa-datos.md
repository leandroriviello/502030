# Módulo 1 · Capa de Datos (IndexedDB)

Este módulo define la base técnica para almacenar información financiera en el navegador utilizando **IndexedDB** con TypeScript estricto.

## Objetivos

- Modelar entidades clave: transacciones, fondos, tarjetas y suscripciones.
- Exponer un esquema centralizado (`STORE_DEFINITIONS`) que controla la versión y estructura de los almacenes.
- Ofrecer funciones utilitarias para operaciones CRUD tipadas y reutilizables.

## Componentes principales

- `src/data/models.ts`  
  Define los tipos de dominio (`TransactionEntity`, `FundEntity`, `CardEntity`, `SubscriptionEntity`) y metadatos comunes (`BaseEntity`, `FinanceStoreName`, `FinanceEntityMap`).

- `src/data/schema.ts`  
  Declara las constantes `FINANCE_DB_NAME`, `FINANCE_DB_VERSION` y las definiciones de cada object store con sus índices optimizados.

- `src/data/finance-db.ts`  
  Implementa helpers asincrónicos basados en promesas (`openFinanceDB`, `getAllFromStore`, `getById`, `upsertEntity`, `deleteById`, `clearStore`, `queryByIndex`). Cada helper verifica la disponibilidad de IndexedDB y gestiona transacciones de forma segura.

- `src/data/index.ts`  
  Punto de entrada central para importar el módulo completo en otras capas.

## Próximos pasos sugeridos

- Crear un hook React para exponer consultas reactivas sobre los almacenes.
- Diseñar un sistema de seeds iniciales que facilite la demo del tablero.
- Integrar la capa de datos con la futura tienda global (Zustand) para hidratar estados.
