import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { Products } from './src/collections/Products'
import { Tickets } from './src/collections/Tickets'
import { Users } from './src/collections/Users'

export default buildConfig({
  admin: { user: Users.slug, importMap: { baseDir: new URL('.', import.meta.url).pathname } },
  collections: [Users, Products, Tickets],
  editor: lexicalEditor(),
  db: postgresAdapter({ pool: { connectionString: process.env.DATABASE_URI } }),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: { outputFile: 'src/payload-types.ts' },
})
