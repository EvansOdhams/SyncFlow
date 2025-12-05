# Database Setup Guide for SyncFlow

## Step 1: Install PostgreSQL

### Option A: Download and Install PostgreSQL

1. **Download PostgreSQL**:
   - Visit: https://www.postgresql.org/download/windows/
   - Download the Windows installer
   - Or use: https://www.enterprisedb.com/downloads/postgres-postgresql-downloads

2. **Install PostgreSQL**:
   - Run the installer
   - Remember the password you set for the `postgres` user
   - Default port is 5432 (keep this)
   - Complete the installation

3. **Add PostgreSQL to PATH** (if not automatically added):
   - Find PostgreSQL installation directory (usually `C:\Program Files\PostgreSQL\<version>\bin`)
   - Add to System Environment Variables PATH

### Option B: Use Chocolatey (if you have it)

```powershell
choco install postgresql
```

### Option C: Use Docker (Alternative)

```powershell
docker run --name syncflow-postgres -e POSTGRES_PASSWORD=yourpassword -e POSTGRES_DB=syncflow -p 5432:5432 -d postgres
```

## Step 2: Verify PostgreSQL Installation

Open a new PowerShell/Command Prompt and run:

```powershell
psql --version
```

If you see a version number, PostgreSQL is installed correctly.

## Step 3: Start PostgreSQL Service

```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# Start PostgreSQL service (if not running)
Start-Service postgresql-x64-<version>  # Replace with your version
# Or
net start postgresql-x64-<version>
```

## Step 4: Create the Database

### Method 1: Using psql Command Line

```powershell
# Connect to PostgreSQL (you'll be prompted for password)
psql -U postgres

# Once connected, run:
CREATE DATABASE syncflow;

# Verify database was created
\l

# Exit psql
\q
```

### Method 2: Using pgAdmin (GUI)

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to your PostgreSQL server
3. Right-click on "Databases" → "Create" → "Database"
4. Name: `syncflow`
5. Click "Save"

### Method 3: Using SQL Command (if psql is in PATH)

```powershell
psql -U postgres -c "CREATE DATABASE syncflow;"
```

## Step 5: Configure .env File

The `.env` file has been created in `backend/.env`. You need to update it with your PostgreSQL password:

1. Open `backend/.env` in a text editor
2. Update the `DB_PASSWORD` line with your PostgreSQL password:
   ```
   DB_PASSWORD=your_postgres_password_here
   ```

3. Also set a secure JWT secret:
   ```
   JWT_SECRET=your_random_secret_key_here
   ```
   You can generate a random secret using:
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

## Step 6: Install Backend Dependencies

```powershell
cd backend
npm install
```

## Step 7: Run Database Migrations

```powershell
# Make sure you're in the backend directory
cd backend

# Run migrations
npm run migrate
```

You should see:
```
🔄 Starting database migrations...
✅ Database migrations completed successfully
```

## Troubleshooting

### Issue: "psql: command not found"

**Solution**: PostgreSQL is not in your PATH. Either:
- Add PostgreSQL bin directory to PATH
- Use full path: `"C:\Program Files\PostgreSQL\<version>\bin\psql.exe" -U postgres`
- Use pgAdmin GUI instead

### Issue: "password authentication failed"

**Solution**: 
- Check the password in `backend/.env` matches your PostgreSQL password
- Try resetting PostgreSQL password if needed

### Issue: "database does not exist"

**Solution**: 
- Make sure you created the database: `CREATE DATABASE syncflow;`
- Verify database name in `.env` matches

### Issue: "connection refused" or "could not connect"

**Solution**:
- Check if PostgreSQL service is running: `Get-Service postgresql*`
- Start the service if stopped
- Verify port 5432 is not blocked by firewall
- Check `DB_HOST` and `DB_PORT` in `.env`

### Issue: "relation does not exist"

**Solution**: 
- Run migrations: `npm run migrate`
- Check if schema.sql was executed correctly

## Verify Database Setup

After running migrations, you can verify tables were created:

```powershell
psql -U postgres -d syncflow -c "\dt"
```

You should see all the tables:
- users
- platforms
- products
- product_platforms
- orders
- sync_logs
- inventory_history
- webhook_events
- notification_preferences

## Next Steps

Once the database is set up:
1. ✅ Database created
2. ✅ Migrations run
3. ⏭️ Start backend server: `npm run dev`
4. ⏭️ Test connection: Visit http://localhost:3001/health

