import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const db = drizzle(pool);

async function checkMigrationStatus() {
  try {
    console.log('🔍 Checking migration status...\n');
    
    // Check if migrations table exists
    const tableExistsQuery = `
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = '_drizzle_migrations'
      );
    `;
    
    const tableExistsResult = await pool.query(tableExistsQuery);
    const tableExists = tableExistsResult.rows[0];
    
    if (!tableExists.exists) {
      console.log('⚠️  Migrations table does not exist. This appears to be a fresh database.');
      return;
    }
    
    // Get applied migrations from database
    const appliedMigrationsQuery = `
      SELECT hash, created_at 
      FROM _drizzle_migrations 
      ORDER BY created_at;
    `;
    
    const appliedMigrations = await pool.query(appliedMigrationsQuery);
    
    // Get migration files from filesystem
    const migrationsDir = path.join(process.cwd(), 'drizzle');
    const migrationFiles = fs.existsSync(migrationsDir) 
      ? fs.readdirSync(migrationsDir).filter(file => file.endsWith('.sql'))
      : [];
    
    console.log(`📊 Migration Status:`);
    console.log(`   Applied in DB: ${appliedMigrations.rows.length}`);
    console.log(`   Files on disk: ${migrationFiles.length}\n`);
    
    if (appliedMigrations.rows.length === 0 && migrationFiles.length === 0) {
      console.log('✅ No migrations found. Clean state.');
    } else if (appliedMigrations.rows.length > migrationFiles.length) {
      console.log('⚠️  WARNING: More migrations applied in DB than files on disk!');
      console.log('   This could indicate missing migration files.');
    } else if (migrationFiles.length > appliedMigrations.rows.length) {
      console.log('📋 Pending migrations found.');
      console.log(`   ${migrationFiles.length - appliedMigrations.rows.length} migration(s) need to be applied.`);
    } else {
      console.log('✅ All migrations are in sync.');
    }
    
    // List recent migrations
    if (appliedMigrations.rows.length > 0) {
      console.log('\n📝 Recent applied migrations:');
      appliedMigrations.rows.slice(-5).forEach((migration, index) => {
        console.log(`   ${index + 1}. ${migration.hash} (${new Date(migration.created_at).toLocaleString()})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error checking migration status:', error);
  } finally {
    await pool.end();
  }
}

// Run if called directly
if (require.main === module) {
  checkMigrationStatus();
}

export { checkMigrationStatus };
