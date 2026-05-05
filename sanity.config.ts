
'use client';

/**
 * Konfigurasi utama untuk Sanity Studio yang tertanam dalam rute /studio.
 */

import {visionTool} from '@sanity/vision';
import {defineConfig} from 'sanity';
import {structureTool} from 'sanity/structure';

import {apiVersion, dataset, projectId} from './src/sanity/env';
import {schema} from './src/sanity/schemaTypes';

export default defineConfig({
  basePath: '/studio',
  projectId,
  dataset,
  // Tambahkan schema yang telah kita buat
  schema,
  plugins: [
    structureTool(),
    // Vision membantu kita menguji query GROQ langsung di studio
    visionTool({defaultApiVersion: apiVersion}),
  ],
});
