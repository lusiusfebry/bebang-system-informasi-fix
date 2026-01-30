import { prisma } from '../lib/prisma';

// Re-export prisma for use in other files
export { prisma };

// Connect to database
export async function connectDatabase(): Promise<void> {
    try {
        await prisma.$connect();
        console.log('✅ Database connected successfully');
    } catch (error) {
        console.error('❌ Database connection failed:', error);
        process.exit(1);
    }
}

// Disconnect from database
export async function disconnectDatabase(): Promise<void> {
    await prisma.$disconnect();
    console.log('🔌 Database disconnected');
}
