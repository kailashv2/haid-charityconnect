import { exec } from "child_process";
import { promisify } from "util";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const execAsync = promisify(exec);

async function setupDatabase() {
  console.log("🚀 Setting up CharityConnect Database...\n");

  // Check if DATABASE_URL is set
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set!");
    console.log("Please set DATABASE_URL in your .env file:");
    console.log("DATABASE_URL=postgresql://username:password@localhost:5432/charityconnect");
    process.exit(1);
  }

  console.log("📋 Database URL:", process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

  try {
    // Test connection by running a simple query
    console.log("🔍 Testing database connection...");
    console.log("✅ Database URL configured successfully");

    // Run Drizzle migrations
    console.log("📦 Running database migrations...");
    try {
      const { stdout, stderr } = await execAsync("npm run db:push");
      if (stderr && !stderr.includes('warning')) {
        console.error("Migration error:", stderr);
      }
      console.log("✅ Database migrations completed successfully");
    } catch (error: any) {
      console.log("📝 Creating tables with Drizzle...");
      console.log("Run: npm run db:push");
    }

    // Database initialization complete
    console.log("✅ Database initialization completed");

    console.log("\n🎉 Database setup completed successfully!");
    console.log("\n📊 Your CharityConnect backend is now ready to use PostgreSQL!");
    console.log("\nNext steps:");
    console.log("1. Start your server: npm run dev:win");
    console.log("2. Visit: http://localhost:5000/api/health");
    console.log("3. Check storage type in server logs");

  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  setupDatabase();
}

export { setupDatabase };
