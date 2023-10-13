
import Dexie from 'dexie';

export const db = new Dexie('myDatabase');
db.version(1).stores({
  figures: '++id, label, base64', // Primary key and indexed props
});