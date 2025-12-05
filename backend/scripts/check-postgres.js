import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkPostgreSQL() {
  console.log('🔍 Checking PostgreSQL installation...\n');

  try {
    // Try to find psql
    const { stdout } = await execAsync('psql --version');
    console.log('✅ PostgreSQL found!');
    console.log(`   Version: ${stdout.trim()}\n`);
    return true;
  } catch (error) {
    console.log('❌ PostgreSQL not found in PATH\n');
    console.log('📋 To install PostgreSQL:');
    console.log('   1. Download from: https://www.postgresql.org/download/windows/');
    console.log('   2. Or use Chocolatey: choco install postgresql');
    console.log('   3. Or use Docker: docker run --name syncflow-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=syncflow -p 5432:5432 -d postgres\n');
    return false;
  }
}

async function checkDatabase() {
  console.log('🔍 Checking database connection...\n');

  try {
    const { query } = await import('../src/database/connection.js');
    await query('SELECT 1');
    console.log('✅ Database connection successful!\n');
    return true;
  } catch (error) {
    console.log('❌ Database connection failed!\n');
    console.log('Error:', error.message);
    console.log('\n📋 Make sure:');
    console.log('   1. PostgreSQL is installed and running');
    console.log('   2. Database "syncflow" exists');
    console.log('   3. Credentials in .env are correct\n');
    return false;
  }
}

async function main() {
  const pgInstalled = await checkPostgreSQL();
  
  if (pgInstalled) {
    await checkDatabase();
  }
}

main().catch(console.error);

