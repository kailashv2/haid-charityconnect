# CharityConnect (HAID) - Complete Setup & Run Guide

## 🎯 Quick Start (For Experienced Users)
```powershell
# 1. Install dependencies
npm install --legacy-peer-deps

# 2. Setup database
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; npm run db:push

# 3. Start application
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; $env:NODE_ENV="development"; npx tsx server/index.ts
```

## 📋 Prerequisites
- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **PowerShell** (Windows) or Terminal (Mac/Linux)

## 🚀 Step-by-Step Setup

### Step 1: Navigate to Project Directory
```powershell
cd "path\to\your\CharityConnect\CharityConnect"
# Replace with your actual project path
```

### Step 2: Install Dependencies
```powershell
# This fixes dependency conflicts
npm install --legacy-peer-deps
```
**⚠️ Important**: Use `--legacy-peer-deps` flag to resolve version conflicts.

### Step 3: Setup Database Schema
```powershell
# Set database URL and push schema
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; npm run db:push
```

### Step 4: Start the Application
```powershell
# Start server with proper environment variables
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; $env:NODE_ENV="development"; npx tsx server/index.ts
```

**✅ Expected Terminal Output:**
```
📊 Using PostgreSQL storage
Stripe not configured: STRIPE_SECRET_KEY not provided
dotenv not available, using system environment variables
2:07:31 PM [express] serving on port 5000

🌐 CharityConnect (HAID) is running!
📱 Open in browser: http://localhost:5000
🏥 Health check: http://localhost:5000/api/health
📊 Analytics: http://localhost:5000/analytics
```

**🎉 SUCCESS! When you see "serving on port 5000", the app is ready!**

**🌐 Open your browser and go to:** http://localhost:5000

> **💡 Tip**: In most terminals, you can Ctrl+Click on http://localhost:5000 to open it directly in your browser!

## 🌐 Access URLs
- **🏠 Main App**: http://localhost:5000
- **🏥 Health Check**: http://localhost:5000/api/health
- **📊 Analytics API**: http://localhost:5000/api/analytics
- **🗄️ Database Studio**: http://localhost:4983 (run `npm run db:studio` in new terminal)

## 🗄️ Check Database Data

### Visual Interface
```bash
npm run db:studio
```

### SQL Commands
```bash
psql 'postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'

\dt                           # List tables
SELECT * FROM donors;         # View donors
SELECT * FROM item_donations; # View donations
\q                           # Exit
```

### API Endpoints
```bash
curl http://localhost:5000/api/analytics  # Get statistics
curl http://localhost:5000/api/donations  # Get all donations
curl http://localhost:5000/api/needy      # Get needy persons
```

## 🧪 Test Data
```bash
# Create test donation
curl -X POST http://localhost:5000/api/donations/items \
  -H "Content-Type: application/json" \
  -d '{
    "donor": {"name": "Test User", "email": "test@example.com", "phone": "9876543210"},
    "item": {"category": "Food", "condition": "New", "description": "Test donation"}
  }'

# Verify data created
curl http://localhost:5000/api/analytics
```

## 🔧 Troubleshooting

### Common Issues & Solutions

#### ❌ "npm install" fails with dependency conflicts
```powershell
# Solution: Use legacy peer deps flag
npm install --legacy-peer-deps
```

#### ❌ "tsx is not recognized" error
```powershell
# Solution: Use npx instead of global tsx
npx tsx server/index.ts
```

#### ❌ Database connection errors
```powershell
# Solution: Ensure DATABASE_URL is set correctly
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
npm run db:push
```

#### ❌ Port 5000 already in use
```powershell
# Kill existing processes
taskkill /F /IM node.exe
# Or check what's using port 5000
netstat -an | findstr 5000
```

#### ❌ Server starts but no UI loads
- Make sure you're accessing http://localhost:5000 (not https)
- Check browser console for errors
- Verify server logs show "serving on port 5000"

### Alternative Commands (if npm scripts fail)
```powershell
# Alternative start command
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; $env:NODE_ENV="development"; node_modules\.bin\tsx server/index.ts

# Force database schema update
$env:DATABASE_URL="postgresql://neondb_owner:npg_PhINY1FAQc3v@ep-rough-dew-ad1ocjfe-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"; npm run db:push -- --force
```

## ✅ Success Checklist
When everything is working correctly, you should see:

- [ ] ✅ Dependencies installed without errors
- [ ] ✅ Database schema pushed successfully  
- [ ] ✅ Server console shows "📊 Using PostgreSQL storage"
- [ ] ✅ Server console shows "serving on port 5000"
- [ ] ✅ http://localhost:5000 loads the CharityConnect website
- [ ] ✅ http://localhost:5000/api/health returns {"status":"healthy"}
- [ ] ✅ No error messages in browser console

## 🎉 What You Can Do Now
- **Donate Items**: Visit /donate-items to donate physical goods
- **Donate Money**: Visit /donate-money for monetary donations (Stripe needed)
- **Register Needy**: Visit /register-needy to register people in need
- **View Analytics**: Visit /analytics to see donation statistics
- **API Testing**: Use the API endpoints for integration testing

## 📞 Need Help?
If you're still having issues:
1. Check that Node.js v18+ is installed: `node --version`
2. Ensure you're in the correct directory with package.json
3. Try deleting node_modules and running `npm install --legacy-peer-deps` again
4. Make sure no antivirus is blocking the application
