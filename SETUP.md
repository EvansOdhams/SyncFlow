# SyncFlow - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PostgreSQL** (v12 or higher) - [Download](https://www.postgresql.org/download/)
- **Git** - [Download](https://git-scm.com/)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/EvansOdhams/SyncFlow.git
cd SyncFlow
```

### 2. Install Dependencies

Install dependencies for all projects:

```bash
npm run install:all
```

Or install individually:

```bash
# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 3. Database Setup

#### Create PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE syncflow;

# Exit psql
\q
```

#### Run Database Migrations

```bash
cd backend

# Copy environment file
cp .env.example .env

# Edit .env and update database credentials
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=syncflow
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run migrations
npm run migrate
```

### 4. Configure Environment Variables

#### Backend Configuration

Edit `backend/.env`:

```env
# Server
NODE_ENV=development
PORT=3001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=syncflow
DB_USER=postgres
DB_PASSWORD=your_password

# JWT
JWT_SECRET=your_secret_key_here
JWT_EXPIRES_IN=7d

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

#### Frontend Configuration

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:3001/api/v1
```

### 5. Start Development Servers

#### Option 1: Run Both Servers Together

From the root directory:

```bash
npm run dev
```

#### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### 6. Verify Installation

- **Backend API**: http://localhost:3001/health
- **Frontend**: http://localhost:3000

## AWS Setup (Optional - for Cloud Features)

### 1. Install AWS CLI

```bash
# Windows (using Chocolatey)
choco install awscli

# Or download from: https://aws.amazon.com/cli/
```

### 2. Configure AWS Credentials

```bash
aws configure
```

Enter your:
- AWS Access Key ID
- AWS Secret Access Key
- Default region (e.g., us-east-1)
- Default output format (json)

### 3. Deploy Infrastructure

```bash
cd infrastructure

# Deploy CloudFormation stack
aws cloudformation create-stack \
  --stack-name syncflow-dev \
  --template-body file://cloudformation-template.yaml \
  --parameters ParameterKey=Environment,ParameterValue=development
```

## Third-Party Service Setup

### Shopify

1. Create a Shopify Partner account: https://partners.shopify.com/
2. Create a new app
3. Get API credentials
4. Add to `backend/.env`:
   ```
   SHOPIFY_API_KEY=your_key
   SHOPIFY_API_SECRET=your_secret
   ```

### WooCommerce

1. Install WooCommerce on your WordPress site
2. Go to WooCommerce > Settings > Advanced > REST API
3. Create a new API key
4. Add to `backend/.env`:
   ```
   WOOCOMMERCE_API_URL=https://yourstore.com
   WOOCOMMERCE_CONSUMER_KEY=your_key
   WOOCOMMERCE_CONSUMER_SECRET=your_secret
   ```

### Google Sheets API

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create OAuth 2.0 credentials
5. Add to `backend/.env`:
   ```
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=http://localhost:3001/api/v1/auth/google/callback
   ```

### Twilio (SMS)

1. Sign up at [Twilio](https://www.twilio.com/)
2. Get Account SID and Auth Token
3. Get a phone number
4. Add to `backend/.env`:
   ```
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ```

### SendGrid (Email)

1. Sign up at [SendGrid](https://sendgrid.com/)
2. Create API key
3. Verify sender email
4. Add to `backend/.env`:
   ```
   SENDGRID_API_KEY=your_api_key
   SENDGRID_FROM_EMAIL=noreply@yourdomain.com
   ```

## Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running: `pg_isready`
- Check database credentials in `.env`
- Ensure database exists: `psql -U postgres -l`

### Port Already in Use

- Change port in `backend/.env` (PORT=3002)
- Or kill process using port:
  ```bash
  # Windows
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  ```

### Module Not Found Errors

- Delete `node_modules` and reinstall:
  ```bash
  rm -rf node_modules
  npm install
  ```

## Next Steps

1. Review the [Implementation Roadmap](./docs/IMPLEMENTATION_ROADMAP.md)
2. Start with Phase 1: MVP Core
3. Follow the week-by-week tasks

## Support

For issues or questions:
- Check the [README](./README.md)
- Review [Project Proposal](./docs/PROJECT_PROPOSAL.md)
- Open an issue on GitHub

