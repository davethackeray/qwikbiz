#!/usr/bin/env ts-node

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import dotenv from 'dotenv';
import { validateEnv } from '../src/lib/config/env.js';

// Set up __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from .env files
dotenv.config({ path: resolve(__dirname, '../.env.local') });

// Just validate environment variables and exit with appropriate code
process.exit(validateEnv() ? 0 : 1);
