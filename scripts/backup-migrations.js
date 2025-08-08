const fs = require('fs');
const path = require('path');

// Create backups directory if it doesn't exist
const backupsDir = path.join(__dirname, '..', 'backups', 'migrations');
if (!fs.existsSync(backupsDir)) {
  fs.mkdirSync(backupsDir, { recursive: true });
}

// Copy all migration files to backup
const migrationsDir = path.join(__dirname, '..', 'drizzle');

if (fs.existsSync(migrationsDir)) {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = path.join(backupsDir, `backup-${timestamp}`);
  
  fs.mkdirSync(backupPath, { recursive: true });
  
  const migrationFiles = fs.readdirSync(migrationsDir);
  
  migrationFiles.forEach(file => {
    const sourcePath = path.join(migrationsDir, file);
    const destPath = path.join(backupPath, file);
    fs.copyFileSync(sourcePath, destPath);
  });
  
  console.log(`✅ Migrations backed up to: ${backupPath}`);
  console.log(`📁 Backed up ${migrationFiles.length} files`);
} else {
  console.log('⚠️  No migrations directory found to backup');
}
