// config.ts
import type { Config } from '@/types/type.js'; // Config 型は必要に応じて定義
import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const config: Config = JSON.parse(readFileSync(join(__dirname, './config.json'), 'utf8')) as Config;

export default config;
