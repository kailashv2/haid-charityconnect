# PostgreSQL Database Integration Guide

## 🚀 Quick Setup (Recommended)

### Option 1: Using Neon (Free Cloud Database)

1. **Create Neon Account**: Go to [neon.tech](https://neon.tech) and sign up
2. **Create Database**: Create a new project called "charityconnect"
3. **Get Connection String**: Copy the connection string from dashboard
4. **Update Environment**: Add to your `.env` file:
   ```env
   DATABASE_URL=postgresql://username:password@ep-xxx.us-east-1.aws.neon.tech/charityconnect?sslmode=require
   ```

### Option 2: Local PostgreSQL

1. **Install PostgreSQL**:
   ```bash
   # Windows (using chocolatey)
   choco install postgresql
   
   # Or download from: https://www.postgresql.org/download/
   ```

2. **Create Database**:
   ```sql
   createdb charityconnect
   ```

3. **Update Environment**:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/charityconnect
   ```

### Option 3: Docker (Easy Local Setup)

1. **Run PostgreSQL Container**:
   ```bash
   docker run --name charityconnect-db \
     -e POSTGRES_PASSWORD=yourpassword \
     -e POSTGRES_DB=charityconnect \
     -p 5432:5432 \
     -d postgres:15
   ```

2. **Update Environment**:
   ```env
   DATABASE_URL=postgresql://postgres:yourpassword@localhost:5432/charityconnect
   ```

## 🔧 Setup Database

### Automatic Setup (Recommended)
```bash
# Copy environment file
cp .env.example .env

# Edit .env file and add your DATABASE_URL

# Run automatic setup
npm run db:setup
```

### Manual Setup
```bash
# 1. Push schema to database
npm run db:push

# 2. Start server with database
npm run dev:win
```

## 🎯 Verification

### Check Database Connection
```bash
# Visit health check endpoint
curl http://localhost:5000/api/health

# Should show:
{
  "status": "healthy",
  "services": {
    "stripe": false,
    "twilio": false,
    "sms": false
  }
}
```

### Check Storage Type
Look for this log message when starting server:
```
📊 Using PostgreSQL storage
```

### Test Database Operations
```bash
# Create a test donation via API
curl -X POST http://localhost:5000/api/donations/items \
  -H "Content-Type: application/json" \
  -d '{
    "donor": {
      "name": "Test User",
      "email": "test@example.com",
      "phone": "9876543210"
    },
    "item": {
      "category": "Food",
      "condition": "New",
      "description": "Test donation"
    }
  }'
```

## 🛠️ Database Management

### View Database (Drizzle Studio)
```bash
npm run db:studio
```
Opens web interface at `http://localhost:4983`

### Reset Database
```bash
# Drop and recreate all tables
npm run db:push -- --force
```

### Backup Database
```bash
# PostgreSQL backup
pg_dump charityconnect > backup.sql

# Restore backup
psql charityconnect < backup.sql
```

## 🔄 Migration from In-Memory

Your application automatically detects the database:
- **With DATABASE_URL**: Uses PostgreSQL
- **Without DATABASE_URL**: Uses in-memory storage

No code changes needed! Just set the environment variable.

## 📊 Database Schema

The following tables will be created:
- `donors` - Donor information
- `item_donations` - Physical item donations
- `monetary_donations` - Financial donations
- `needy_persons` - People in need registry
- `sms_logs` - SMS communication logs

## 🚨 Troubleshooting

### Connection Issues
```bash
# Test connection manually
psql "postgresql://username:password@host:port/database"
```

### Permission Issues
```sql
-- Grant permissions
GRANT ALL PRIVILEGES ON DATABASE charityconnect TO username;
```

### SSL Issues (Cloud Databases)
Ensure your DATABASE_URL includes `?sslmode=require` for cloud databases.

### Port Issues
Default PostgreSQL port is 5432. Check if it's available:
```bash
netstat -an | findstr 5432
```

## 🎉 Success!

Once setup is complete:
1. ✅ Database tables created
2. ✅ Connection verified
3. ✅ Server using PostgreSQL storage
4. ✅ All API endpoints working with persistent data

Your CharityConnect application now has full database persistence! 🚀
