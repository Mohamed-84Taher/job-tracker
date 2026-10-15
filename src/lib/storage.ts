import { openDB, type IDBPDatabase } from 'idb';
import type { Application } from '../features/applications/types';

const DB_NAME = 'job-tracker-db';
const DB_VERSION = 1;
const STORE_NAME = 'applications';

/**
 * Open (or create) the IndexedDB database.
 * Uses a singleton promise so we only open once.
 */
function getDb(): Promise<IDBPDatabase> {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
}

// ---------------------------------------------------------------------------
// Public storage interface
// ---------------------------------------------------------------------------

/**
 * Retrieve all applications from IndexedDB.
 */
export async function getAll(): Promise<Application[]> {
  const db = await getDb();
  return db.getAll(STORE_NAME);
}

/**
 * Save (upsert) a single application.
 * If an application with the same `id` exists it will be overwritten.
 */
export async function save(app: Application): Promise<void> {
  const db = await getDb();
  await db.put(STORE_NAME, app);
}

/**
 * Save multiple applications in a single transaction.
 */
export async function saveAll(apps: Application[]): Promise<void> {
  const db = await getDb();
  const tx = db.transaction(STORE_NAME, 'readwrite');
  for (const app of apps) {
    tx.store.put(app);
  }
  await tx.done;
}

/**
 * Remove an application by ID.
 */
export async function remove(id: string): Promise<void> {
  const db = await getDb();
  await db.delete(STORE_NAME, id);
}

/**
 * Remove all applications (useful for testing / reset).
 */
export async function clear(): Promise<void> {
  const db = await getDb();
  await db.clear(STORE_NAME);
}
