require('dotenv').config({ path: '.env.local' })

const { Client } = require('pg')

const statements = [
  `CREATE TABLE IF NOT EXISTS users (
    id serial PRIMARY KEY, name varchar NOT NULL, email varchar NOT NULL UNIQUE,
    hash varchar, salt varchar, login_attempts numeric DEFAULT 0, lock_until timestamptz,
    reset_password_token varchar, reset_password_expiration timestamptz,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS users_sessions (
    id uuid PRIMARY KEY, _parent_id integer NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    _order integer NOT NULL DEFAULT 1, created_at timestamptz DEFAULT now(), expires_at timestamptz
  )`,
  `CREATE TABLE IF NOT EXISTS payload_preferences (
    id serial PRIMARY KEY, key varchar NOT NULL, value jsonb,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS payload_preferences_rels (
    id serial PRIMARY KEY, parent_id integer NOT NULL REFERENCES payload_preferences(id) ON DELETE CASCADE,
    "order" integer NOT NULL DEFAULT 1, path varchar NOT NULL, users_id integer REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS payload_locked_documents (
    id serial PRIMARY KEY, created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS payload_locked_documents_rels (
    id serial PRIMARY KEY, parent_id integer NOT NULL REFERENCES payload_locked_documents(id) ON DELETE CASCADE,
    path varchar NOT NULL, users_id integer REFERENCES users(id) ON DELETE CASCADE,
    products_id integer REFERENCES products(id) ON DELETE CASCADE,
    tickets_id integer REFERENCES tickets(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY, name varchar NOT NULL, description varchar NOT NULL,
    price numeric NOT NULL, tickets_total numeric NOT NULL, raffle_date timestamptz,
    status varchar NOT NULL DEFAULT 'draft', image_url varchar,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  )`,
  `CREATE TABLE IF NOT EXISTS products_gallery (
    id varchar PRIMARY KEY, _parent_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    _order integer NOT NULL DEFAULT 1, image_url varchar NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS tickets (
    id serial PRIMARY KEY, product_id integer NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    number numeric NOT NULL, folio varchar NOT NULL UNIQUE, buyer_name varchar NOT NULL,
    buyer_phone varchar NOT NULL, buyer_email varchar, payment_status varchar NOT NULL DEFAULT 'pending',
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
  )`,
]

async function main() {
  if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL no está configurada')
  const client = new Client({ connectionString: process.env.DATABASE_URL })
  await client.connect()
  for (const statement of statements) await client.query(statement)
  // Repair incomplete sessions created during an earlier bootstrap attempt.
  await client.query(`UPDATE users_sessions SET id = gen_random_uuid() WHERE id IS NULL`)
  await client.query(`ALTER TABLE payload_preferences_rels ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 1`)
  await client.query(`ALTER TABLE payload_locked_documents ADD COLUMN IF NOT EXISTS global_slug varchar`)
  await client.query(`ALTER TABLE payload_locked_documents_rels ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 1`)
  await client.query(`ALTER TABLE products ALTER COLUMN raffle_date DROP NOT NULL`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS gallery_urls varchar`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS first_place varchar`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS second_place varchar`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS third_place varchar`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS draw_mode varchar NOT NULL DEFAULT 'scheduled'`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS winner_first numeric`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS winner_second numeric`)
  await client.query(`ALTER TABLE products ADD COLUMN IF NOT EXISTS winner_third numeric`)
  await client.query(`ALTER TABLE products_gallery ADD COLUMN IF NOT EXISTS placement varchar NOT NULL DEFAULT 'gallery'`)
  // Payload creates string IDs for array rows. Earlier bootstrap versions used
  // a serial ID, which prevents saving photo galleries from the admin panel.
  await client.query(`ALTER TABLE products_gallery ALTER COLUMN id DROP DEFAULT`)
  await client.query(`ALTER TABLE products_gallery ALTER COLUMN id TYPE varchar USING id::varchar`)
  const { rows: legacyProducts } = await client.query(`SELECT id, image_url, gallery_urls FROM products`)
  for (const product of legacyProducts) {
    const urls = [product.image_url, ...(product.gallery_urls || '').split(/\r?\n/)].map((url) => url?.trim()).filter(Boolean)
    for (const [index, url] of urls.entries()) {
      await client.query(`INSERT INTO products_gallery (_parent_id, _order, image_url) SELECT $1, $2, $3::varchar WHERE NOT EXISTS (SELECT 1 FROM products_gallery WHERE _parent_id = $1 AND image_url = $3::varchar)`, [product.id, index + 1, url])
    }
  }
  await client.end()
  console.log('Neon schema initialized')
}

main().catch((error) => { console.error(error); process.exit(1) })
