import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import path from 'path'
import { fileURLToPath } from 'url'
import { Products } from './src/collections/Products'
import { Tickets } from './src/collections/Tickets'
import { Users } from './src/collections/Users'

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: path.dirname(fileURLToPath(import.meta.url)) } },
  collections: [Users, Products, Tickets],
  editor: lexicalEditor(),
  // Vercel's Neon integration provides DATABASE_URL. DATABASE_URI is kept for local/manual setups.
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URL || process.env.DATABASE_URI } }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: 'src/payload-types.ts' },
})
