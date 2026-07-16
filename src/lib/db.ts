import Database from 'better-sqlite3';
import { mkdirSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const dataDir = process.env.DATA_DIR ?? 'data';
mkdirSync(dataDir, { recursive: true });

export const db = new Database(join(dataDir, 'site.db'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

// Numbered .sql files in migrations/, each applied exactly once, in order.
db.exec('CREATE TABLE IF NOT EXISTS migrations (name TEXT PRIMARY KEY)');
const applied = new Set(db.prepare('SELECT name FROM migrations').pluck().all());
for (const file of readdirSync('migrations').filter((f) => f.endsWith('.sql')).sort()) {
  if (applied.has(file)) continue;
  db.transaction(() => {
    db.exec(readFileSync(join('migrations', file), 'utf8'));
    db.prepare('INSERT INTO migrations (name) VALUES (?)').run(file);
  })();
}
