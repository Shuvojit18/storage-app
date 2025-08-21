import fs from 'fs-extra';
import { DATA_DIR, DB_FILE, MEDIA_DIR, AVATAR_DIR } from '../config/env.js';

await fs.ensureDir(DATA_DIR);
await fs.ensureDir(MEDIA_DIR);
await fs.ensureDir(AVATAR_DIR);
if (!(await fs.pathExists(DB_FILE))) await fs.writeJson(DB_FILE, { users: [], media: [] }, { spaces: 2 });

export const readDB  = () => fs.readJson(DB_FILE);
export const writeDB = (db) => fs.writeJson(DB_FILE, db, { spaces: 2 });
