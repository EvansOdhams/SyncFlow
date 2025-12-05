# Database Setup Status

## ✅ Completed Steps

1. ✅ **Backend dependencies installed** - `node_modules` exists
2. ✅ **Environment file created** - `backend/.env` is ready
3. ✅ **Database schema prepared** - `backend/src/database/schema.sql` ready

## ⏳ Next Steps Required

### Step 1: Install PostgreSQL

**PostgreSQL is not currently installed or not in PATH.**

Choose one installation method:

#### Method 1: Windows Installer (Recommended)
1. Download: https://www.postgresql.org/download/windows/
2. Run installer
3. **Important**: Remember the password you set for `postgres` user
4. Default port: 5432 (keep this)

#### Method 2: Chocolatey
```powershell
choco install postgresql
```

#### Method 3: Docker (Quick Setup)
```powershell
docker run --name syncflow-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=syncflow `
  -p 5432:5432 `
  -d postgres
```

### Step 2: Create Database

After PostgreSQL is installed, create the database:

**Using psql:**
```powershell
psql -U postgres -c "CREATE DATABASE syncflow;"
```

**Using pgAdmin (GUI):**
1. Open pgAdmin 4
2. Connect to server
3. Right-click "Databases" → Create → Database
4. Name: `syncflow`

### Step 3: Update .env File

Edit `backend/.env` and set:

1. **PostgreSQL Password:**
   ```
   DB_PASSWORD=your_postgres_password
   ```

2. **Generate JWT Secret:**
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Then update in `.env`:
   ```
   JWT_SECRET=<paste_generated_secret>
   ```

### Step 4: Run Migrations

```powershell
cd backend
npm run migrate
```

**Expected Output:**
```
🔄 Starting database migrations...
✅ Database migrations completed successfully
```

## Quick Commands Reference

```powershell
# Check PostgreSQL installation
cd backend
npm run check:postgres

# Create database (if psql is available)
psql -U postgres -c "CREATE DATABASE syncflow;"

# Run migrations
cd backend
npm run migrate

# Verify tables were created
psql -U postgres -d syncflow -c "\dt"
```

## Troubleshooting

### "psql: command not found"
- PostgreSQL not in PATH
- Add to PATH: `C:\Program Files\PostgreSQL\<version>\bin`
- Or use full path: `"C:\Program Files\PostgreSQL\16\bin\psql.exe"`

### "password authentication failed"
- Check password in `backend/.env` matches PostgreSQL password
- Default user is `postgres`

### "database does not exist"
- Run: `CREATE DATABASE syncflow;`
- Verify database name in `.env` is correct

## Files Ready

- ✅ `backend/.env` - Environment configuration
- ✅ `backend/src/database/schema.sql` - Database schema
- ✅ `backend/src/database/migrate.js` - Migration script
- ✅ `backend/src/database/connection.js` - Database connection

## After Database Setup

Once migrations complete successfully:

1. **Start Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Test:**
   - Visit: http://localhost:3001/health
   - Should return: `{"status":"ok"}`

---

**Current Status**: Waiting for PostgreSQL installation and database creation.

