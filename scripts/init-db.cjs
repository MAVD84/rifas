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
    path varchar NOT NULL, users_id integer REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS products (
    id serial PRIMARY KEY, name varchar NOT NULL, description varchar NOT NULL,
    price numeric NOT NULL, tickets_total numeric NOT NULL, raffle_date timestamptz NOT NULL,
    status varchar NOT NULL DEFAULT 'draft', image_url varchar,
    created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now()
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
  // Earlier bootstrap versions created this key as an integer; Payload uses UUIDs.
  await client.query(`ALTER TABLE users_sessions ALTER COLUMN id DROP DEFAULT`)
  await client.query(`ALTER TABLE users_sessions ALTER COLUMN id TYPE uuid USING NULL::uuid`)
  await client.end()
  console.log('Neon schema initialized')
}

main().catch((error) => { console.error(error); process.exit(1) })
