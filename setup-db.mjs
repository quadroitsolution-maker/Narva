/**
 * setup-db.mjs
 * Executes schema.sql and seed.sql against Supabase via the REST API
 * using a PostgreSQL-compatible approach.
 * Run: node setup-db.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createClient } from '@supabase/supabase-js'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = 'https://uereguagikpzbnplteci.supabase.co'
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVlcmVndWFnaWtwemJucGx0ZWNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjkxNzAxNCwiZXhwIjoyMDk4NDkzMDE0fQ.ihV7yY_1ML91l_-2aXU3p63usWHDEi1m0agaJf1f5GA'

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
})

// Execute raw SQL via Supabase's pg endpoint
async function execSQL(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ sql_query: sql })
  })
  return res
}

// Split SQL file into individual executable statements
function splitStatements(sql) {
  // Remove single-line comments
  const cleaned = sql.replace(/--[^\n]*/g, '')
  // Split on semicolons but be careful with function bodies
  const stmts = []
  let current = ''
  let dollarDepth = 0
  
  for (let i = 0; i < cleaned.length; i++) {
    const ch = cleaned[i]
    const peek = cleaned.slice(i, i + 2)
    
    if (peek === '$$') {
      dollarDepth = dollarDepth === 0 ? 1 : 0
      current += ch
      continue
    }
    
    if (ch === ';' && dollarDepth === 0) {
      const stmt = current.trim()
      if (stmt.length > 5) stmts.push(stmt)
      current = ''
    } else {
      current += ch
    }
  }
  
  if (current.trim().length > 5) stmts.push(current.trim())
  return stmts
}

async function runStatementsViaFetch(statements, label) {
  console.log(`\n▶  ${label} (${statements.length} statements)`)
  let ok = 0, skip = 0, fail = 0

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    
    // Use Supabase's pg REST endpoint
    const res = await fetch(`${SUPABASE_URL}/pg/query`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: stmt })
    })

    if (res.ok) {
      ok++
      process.stdout.write('.')
    } else {
      const body = await res.text()
      // Common safe-to-ignore errors
      if (body.includes('already exists') || body.includes('duplicate key') || 
          body.includes('does not exist') || body.includes('ON CONFLICT')) {
        skip++
        process.stdout.write('·')
      } else {
        fail++
        console.log(`\n  ⚠ [${i+1}]: ${body.substring(0, 150)}`)
      }
    }
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\n     ✓ ${ok} ok · ${skip} skipped · ${fail} failed`)
  return fail
}

async function runViaSupabaseRpc(statements, label) {
  console.log(`\n▶  ${label} via RPC (${statements.length} statements)`)
  let ok = 0, skip = 0, fail = 0

  for (let i = 0; i < statements.length; i++) {
    const stmt = statements[i]
    const { error } = await supabase.rpc('query', { sql: stmt }).single()
    
    if (!error) {
      ok++
      process.stdout.write('.')
    } else {
      const msg = error.message || ''
      if (msg.includes('already exists') || msg.includes('duplicate') || msg.includes('conflict')) {
        skip++
        process.stdout.write('·')
      } else if (msg.includes('Could not find the function')) {
        // RPC not available, abort
        return null
      } else {
        fail++
        console.log(`\n  ⚠ [${i+1}]: ${msg.substring(0, 150)}`)
      }
    }
    await new Promise(r => setTimeout(r, 50))
  }

  console.log(`\n     ✓ ${ok} ok · ${skip} skipped · ${fail} failed`)
  return fail
}

async function main() {
  console.log('🚀  Narva Health — Supabase DB Setup')
  console.log(`    URL: ${SUPABASE_URL}`)
  console.log('─'.repeat(55))

  const schemaSql = readFileSync(join(__dirname, 'supabase', 'schema.sql'), 'utf-8')
  const seedSql   = readFileSync(join(__dirname, 'supabase', 'seed.sql'), 'utf-8')

  const schemaStmts = splitStatements(schemaSql)
  const seedStmts   = splitStatements(seedSql)

  // Try /pg/query endpoint first
  const testRes = await fetch(`${SUPABASE_URL}/pg/query`, {
    method: 'POST',
    headers: {
      'apikey': SERVICE_ROLE_KEY,
      'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ query: 'SELECT 1' })
  })

  if (testRes.ok) {
    console.log('✓  Connected via /pg/query endpoint')
    await runStatementsViaFetch(schemaStmts, 'schema.sql')
    await runStatementsViaFetch(seedStmts, 'seed.sql')
  } else {
    // Fall back to Management REST API pattern
    console.log(`  /pg/query not available (${testRes.status}), trying Management API...`)
    
    const PROJECT_REF = 'uereguagikpzbnplteci'
    
    // Try the full schema as one shot via management API
    const mgmtTest = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: 'SELECT 1' })
    })
    
    if (mgmtTest.ok) {
      console.log('✓  Connected via Management API')
      // Run statements via management API
      for (const [stmts, label] of [[schemaStmts, 'schema.sql'], [seedStmts, 'seed.sql']]) {
        console.log(`\n▶  ${label} (${stmts.length} statements)`)
        let ok = 0, skip = 0, fail = 0
        for (const stmt of stmts) {
          const r = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ query: stmt })
          })
          if (r.ok) { ok++; process.stdout.write('.') }
          else {
            const b = await r.text()
            if (b.includes('already exists') || b.includes('duplicate')) { skip++; process.stdout.write('·') }
            else { fail++; console.log(`\n  ⚠ ${b.substring(0,150)}`) }
          }
          await new Promise(r => setTimeout(r, 80))
        }
        console.log(`\n     ✓ ${ok} ok · ${skip} skipped · ${fail} failed`)
      }
    } else {
      console.log('\n❌  Could not connect to any Supabase API endpoint.')
      console.log('\n    Please run the SQL manually:')
      console.log('    1. Go to: https://supabase.com/dashboard/project/uereguagikpzbnplteci/sql/new')
      console.log('    2. Paste the contents of supabase/schema.sql and click Run')
      console.log('    3. Then paste supabase/seed.sql and click Run')
      process.exit(1)
    }
  }

  console.log('\n' + '─'.repeat(55))
  console.log('✅  Setup complete! Verifying tables...\n')

  // Verify by checking key tables
  const tables = ['products', 'reviews', 'blog_posts', 'coupons', 'consultation_slots', 'subscribers', 'orders']
  for (const table of tables) {
    const { count, error } = await supabase.from(table).select('*', { count: 'exact', head: true })
    if (error) {
      console.log(`  ✗ ${table.padEnd(25)} — ERROR: ${error.message}`)
    } else {
      console.log(`  ✓ ${table.padEnd(25)} — ${count ?? 0} rows`)
    }
  }
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message)
  process.exit(1)
})
