/**
 * setup-db.cjs
 * Connects directly to Supabase PostgreSQL and runs schema + seed SQL.
 * Usage: node setup-db.cjs <db-password>
 * 
 * Get the DB password from:
 * https://supabase.com/dashboard/project/uereguagikpzbnplteci/settings/database
 * (Settings → Database → Database password → Reveal)
 */

const { Client } = require('pg')
const { readFileSync } = require('fs')
const { join } = require('path')

const PROJECT_REF = 'uereguagikpzbnplteci'
const DB_PASSWORD = process.argv[2]

if (!DB_PASSWORD) {
  console.log('\n❌  Please provide your Supabase DB password as an argument:')
  console.log('    node setup-db.cjs <your-db-password>')
  console.log('\n    Find it at:')
  console.log('    https://supabase.com/dashboard/project/uereguagikpzbnplteci/settings/database')
  console.log('    → Database password → Reveal\n')
  process.exit(1)
}

// Supabase connection pooler (port 5432 = Session mode, supports DDL)
const connectionConfig = {
  host: `aws-0-ap-south-1.pooler.supabase.com`,
  port: 5432,
  database: 'postgres',
  user: `postgres.${PROJECT_REF}`,
  password: DB_PASSWORD,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15000
}

// Split SQL into individual statements (handles $$ function bodies)
function splitStatements(sql) {
  const cleaned = sql.replace(/--[^\n]*/g, '\n')
  const stmts = []
  let current = ''
  let inDollar = false

  for (let i = 0; i < cleaned.length; i++) {
    if (cleaned.slice(i, i + 2) === '$$') {
      inDollar = !inDollar
      current += '$$'
      i++
      continue
    }
    if (cleaned[i] === ';' && !inDollar) {
      const stmt = current.trim()
      if (stmt.length > 5) stmts.push(stmt)
      current = ''
    } else {
      current += cleaned[i]
    }
  }
  if (current.trim().length > 5) stmts.push(current.trim())
  return stmts
}

async function runFile(client, sqlPath, label) {
  const sql = readFileSync(sqlPath, 'utf-8')
  const stmts = splitStatements(sql)
  console.log(`\n▶  ${label}  (${stmts.length} statements)`)

  let ok = 0, skipped = 0, failed = 0

  for (let i = 0; i < stmts.length; i++) {
    try {
      await client.query(stmts[i])
      ok++
      process.stdout.write('.')
    } catch (err) {
      const msg = err.message || ''
      // Safe-to-ignore errors
      if (
        msg.includes('already exists') ||
        msg.includes('duplicate key') ||
        msg.includes('ON CONFLICT') ||
        msg.includes('nothing to do')
      ) {
        skipped++
        process.stdout.write('·')
      } else {
        failed++
        console.log(`\n  ⚠ [stmt ${i + 1}]: ${msg.substring(0, 200)}`)
      }
    }
  }

  console.log(`\n     ✓ ${ok} ok  ·  ${skipped} skipped  ·  ${failed} failed`)
  return failed
}

async function main() {
  console.log('\n🚀  Narva Health — Supabase DB Setup')
  console.log(`    Project: ${PROJECT_REF}`)
  console.log(`    Host:    ${connectionConfig.host}`)
  console.log('─'.repeat(55))

  const client = new Client(connectionConfig)

  try {
    console.log('\n  Connecting to PostgreSQL...')
    await client.connect()
    console.log('  ✓ Connected!\n')
  } catch (err) {
    console.log(`\n❌  Connection failed: ${err.message}`)
    console.log('\n    Make sure the password is correct and try again.')
    console.log('    Get DB password from:')
    console.log('    https://supabase.com/dashboard/project/uereguagikpzbnplteci/settings/database')
    process.exit(1)
  }

  try {
    await runFile(client, join(__dirname, 'supabase', 'schema.sql'), 'schema.sql')
    await runFile(client, join(__dirname, 'supabase', 'seed.sql'), 'seed.sql')

    console.log('\n' + '─'.repeat(55))
    console.log('🔍  Verifying tables...\n')

    const tables = [
      'products', 'reviews', 'blog_posts', 'coupons',
      'consultation_slots', 'consultation_bookings',
      'subscribers', 'orders', 'order_items', 'addresses'
    ]

    for (const table of tables) {
      try {
        const res = await client.query(`SELECT COUNT(*) FROM public.${table}`)
        const count = res.rows[0].count
        console.log(`  ✓  ${table.padEnd(25)} ${count.padStart(4)} rows`)
      } catch (err) {
        console.log(`  ✗  ${table.padEnd(25)} ERROR: ${err.message}`)
      }
    }

    console.log('\n✅  All done! Your Supabase database is ready.\n')
  } finally {
    await client.end()
  }
}

main().catch(err => {
  console.error('\n❌ Fatal:', err.message)
  process.exit(1)
})
