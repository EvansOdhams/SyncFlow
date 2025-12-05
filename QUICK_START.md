# Quick Start - Database Setup

## Current Status ✅

- ✅ Backend dependencies installed
- ✅ `.env` file created in `backend/.env`
- ⏳ PostgreSQL setup needed
- ⏳ Database creation needed
- ⏳ Migrations needed

## Next Steps

### Step 1: Install PostgreSQL (if not installed)

**Check if PostgreSQL is installed:**
```powershell
psql --version
```

**If not installed, choose one option:**

#### Option A: Download Installer
1. Visit: https://www.postgresql.org/download/windows/
2. Download and install PostgreSQL
3. **Remember the password** you set for `postgres` user

#### Option B: Use Chocolatey
```powershell
choco install postgresql
```

#### Option C: Use Docker
```powershell
docker run --name syncflow-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=syncflow -p 5432:5432 -d postgres
```

### Step 2: Start PostgreSQL Service

```powershell
# Find PostgreSQL service name
Get-Service | Where-Object {$_.Name -like "*postgres*"}

# Start the service (replace with actual service name)
Start-Service postgresql-x64-16  # Example: adjust version number
```

### Step 3: Create Database

**Option A: Using psql (if in PATH)**
```powershell
psql -U postgres -c "CREATE DATABASE syncflow;"
```

**Option B: Using pgAdmin (GUI)**
1. Open pgAdmin 4
2. Connect to PostgreSQL server
3. Right-click "Databases" → "Create" → "Database"
4. Name: `syncflow`
5. Click "Save"

**Option C: Using SQL file**
```powershell
# If psql is available
psql -U postgres -f create_db.sql
```

### Step 4: Configure .env File

Edit `backend/.env` and update:

1. **Database Password:**
   ```
   DB_PASSWORD=your_postgres_password_here
   ```

2. **JWT Secret** (generate a random one):
   ```powershell
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   Then update in `.env`:
   ```
   JWT_SECRET=<paste_generated_secret_here>
   ```

### Step 5: Run Migrations

```powershell
cd backend
npm run migrate
```

**Expected output:**
```
🔄 Starting database migrations...
✅ Database migrations completed successfully
```

### Step 6: Verify Setup

```powershell
# Test database connection
psql -U postgres -d syncflow -c "\dt"
```

You should see all tables listed.

## Troubleshooting

### PostgreSQL Not Found
- Add PostgreSQL bin to PATH: `C:\Program Files\PostgreSQL\<version>\bin`
- Or use full path: `"C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres`

### Connection Refused
- Check if PostgreSQL service is running
- Verify port 5432 is not blocked
- Check firewall settings

### Password Issues
- Make sure password in `.env` matches PostgreSQL password
- Try connecting manually: `psql -U postgres`

## After Database Setup

Once migrations are successful:

1. **Start Backend Server:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Test Health Endpoint:**
   - Visit: http://localhost:3001/health
   - Should return: `{"status":"ok",...}`

3. **Start Frontend (in new terminal):**
   ```powershell
   cd frontend
   npm install  # if not done yet
   npm run dev
   ```

4. **Access Application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3001

---

**Need Help?** See `DATABASE_SETUP.md` for detailed instructions.

