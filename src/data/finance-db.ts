import {
  FINANCE_DB_NAME,
  FINANCE_DB_VERSION,
  STORE_DEFINITIONS
} from './schema';
import type { FinanceEntityMap, FinanceStoreName } from './models';

/** Determina si el entorno admite IndexedDB (solo navegador) */
const canUseIndexedDB = (): boolean =>
  typeof window !== 'undefined' && typeof window.indexedDB !== 'undefined';

/** Obtiene acceso a la base de datos, creando esquema si es necesario */
export const openFinanceDB = (): Promise<IDBDatabase> => {
  if (!canUseIndexedDB()) {
    return Promise.reject(
      new Error(
        'IndexedDB no está disponible en el entorno actual. Asegúrate de ejecutar este código en el navegador.'
      )
    );
  }

  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = window.indexedDB.open(FINANCE_DB_NAME, FINANCE_DB_VERSION);

    request.onerror = () => {
      reject(
        request.error ??
          new Error('Error desconocido al intentar abrir IndexedDB.')
      );
    };

    request.onsuccess = () => {
      const database = request.result;
      database.onversionchange = () => {
        database.close();
        // Avisamos mediante consola para que la UI pueda manejarlo con un toast
        console.info(
          '[IndexedDB] La base de datos fue actualizada en otra pestaña y se cerró la conexión actual.'
        );
      };
      resolve(database);
    };

    request.onupgradeneeded = () => {
      const database = request.result;

      (Object.entries(STORE_DEFINITIONS) as Array<
        [FinanceStoreName, (typeof STORE_DEFINITIONS)[FinanceStoreName]]
      >).forEach(([storeName, config]) => {
        if (!database.objectStoreNames.contains(storeName)) {
          const store = database.createObjectStore(storeName, {
            keyPath: config.keyPath,
            autoIncrement: config.autoIncrement
          });

          config.indices.forEach((index) => {
            store.createIndex(index.name, index.keyPath, index.options);
          });
        } else {
          const store = request.transaction?.objectStore(storeName);
          config.indices.forEach((index) => {
            if (!store?.indexNames.contains(index.name)) {
              store?.createIndex(index.name, index.keyPath, index.options);
            }
          });
        }
      });
    };
  });
};

/** Convierte la API basada en eventos de IndexedDB a promesas */
const awaitRequest = <T>(request: IDBRequest<T>): Promise<T> =>
  new Promise<T>((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () =>
      reject(
        request.error ??
          new Error('Error desconocido ejecutando una operación en IndexedDB.')
      );
  });

/** Abre una transacción tipada y resuelve cuando finaliza */
const runTransaction = async <Store extends FinanceStoreName, Result>(
  db: IDBDatabase,
  storeName: Store,
  mode: IDBTransactionMode,
  action: (store: IDBObjectStore) => Promise<Result> | Result
): Promise<Result> => {
  const transaction = db.transaction(storeName, mode);
  const store = transaction.objectStore(storeName);

  const outcome = await action(store);

  return new Promise<Result>((resolve, reject) => {
    transaction.oncomplete = () => resolve(outcome);
    transaction.onerror = () =>
      reject(
        transaction.error ??
          new Error('La transacción fue abortada por IndexedDB.')
      );
    transaction.onabort = () =>
      reject(
        transaction.error ??
          new Error('La transacción fue abortada explícitamente.')
      );
  });
};

/** Lee todas las entidades de un almacén específico */
export const getAllFromStore = async <Store extends FinanceStoreName>(
  storeName: Store
): Promise<Array<FinanceEntityMap[Store]>> => {
  const db = await openFinanceDB();

  return runTransaction(db, storeName, 'readonly', async (store) => {
    const request = store.getAll();
    return await awaitRequest(request);
  });
};

/** Obtiene una entidad por su clave primaria */
export const getById = async <
  Store extends FinanceStoreName,
  Entity extends FinanceEntityMap[Store]
>(
  storeName: Store,
  id: Entity['id']
): Promise<Entity | undefined> => {
  const db = await openFinanceDB();

  return runTransaction(db, storeName, 'readonly', async (store) => {
    const request = store.get(id);
    const result = await awaitRequest(request);
    return (result as Entity | undefined) ?? undefined;
  });
};

/** Agrega o actualiza una entidad (upsert) */
export const upsertEntity = async <
  Store extends FinanceStoreName,
  Entity extends FinanceEntityMap[Store]
>(
  storeName: Store,
  entity: Entity
): Promise<Entity> => {
  const db = await openFinanceDB();

  return runTransaction(db, storeName, 'readwrite', async (store) => {
    const existing = (await awaitRequest(store.get(entity.id))) as
      | Entity
      | undefined;
    const stampedEntity: Entity = {
      ...entity,
      createdAt:
        existing?.createdAt ?? entity.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await awaitRequest(store.put(stampedEntity));
    return stampedEntity;
  });
};

/** Elimina una entidad por clave primaria */
export const deleteById = async <
  Store extends FinanceStoreName,
  Entity extends FinanceEntityMap[Store]
>(
  storeName: Store,
  id: Entity['id']
): Promise<void> => {
  const db = await openFinanceDB();

  await runTransaction(db, storeName, 'readwrite', async (store) => {
    await awaitRequest(store.delete(id));
  });
};

/** Limpia todos los registros del almacén indicado */
export const clearStore = async (storeName: FinanceStoreName): Promise<void> => {
  const db = await openFinanceDB();

  await runTransaction(db, storeName, 'readwrite', async (store) => {
    await awaitRequest(store.clear());
  });
};

/** Consulta usando un índice secundario de IndexedDB */
export const queryByIndex = async <
  Store extends FinanceStoreName,
  Entity extends FinanceEntityMap[Store]
>(
  storeName: Store,
  indexName: string,
  query: IDBValidKey | IDBKeyRange
): Promise<Entity[]> => {
  const db = await openFinanceDB();

  return runTransaction(db, storeName, 'readonly', async (store) => {
    const index = store.index(indexName);
    const request = index.getAll(query);
    return (await awaitRequest(request)) as Entity[];
  });
};
