# Update .env File

## Generated JWT Secret
Use this secret in your `.env` file:
```
b79245981ed621a062a6aa2cc8bf54c2fc8787ac9199daa4972715c1788054d9
```

## Steps to Update backend/.env

1. Open `backend/.env` in a text editor

2. Update these two lines:

   **Set your PostgreSQL password:**
   ```
   DB_PASSWORD=your_postgres_password_here
   ```
   (Replace `your_postgres_password_here` with the password you used when creating the database)

   **Set the JWT secret:**
   ```
   JWT_SECRET=b79245981ed621a062a6aa2cc8bf54c2fc8787ac9199daa4972715c1788054d9
   ```

3. Save the file

4. Then run migrations:
   ```powershell
   cd backend
   npm run migrate
   ```

