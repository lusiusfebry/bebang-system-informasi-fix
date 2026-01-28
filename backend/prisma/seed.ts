import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// Number of salt rounds for bcrypt
const SALT_ROUNDS = 10;

// DEV-ONLY credentials - DO NOT USE IN PRODUCTION
const DEV_CREDENTIALS = {
    admin: {
        nik: 'DEV_ADMIN',
        email: 'dev.admin@bebang.local',
        password: 'DevAdmin@2024!',
        fullName: 'Development Administrator',
    },
    user: {
        nik: 'DEV_USER',
        email: 'dev.user@bebang.local',
        password: 'DevUser@2024!',
        fullName: 'Development Test User',
    },
};

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_ROUNDS);
}

async function main() {
    console.log('🌱 Starting database seeding...');
    console.log('⚠️  Using DEV-ONLY credentials - DO NOT USE IN PRODUCTION');

    // Hash passwords before storing
    const adminHashedPassword = await hashPassword(DEV_CREDENTIALS.admin.password);
    const userHashedPassword = await hashPassword(DEV_CREDENTIALS.user.password);

    // Create default admin user with hashed password
    const adminUser = await prisma.user.upsert({
        where: { nik: DEV_CREDENTIALS.admin.nik },
        update: {
            password: adminHashedPassword, // Update password if user exists
        },
        create: {
            nik: DEV_CREDENTIALS.admin.nik,
            email: DEV_CREDENTIALS.admin.email,
            password: adminHashedPassword,
            fullName: DEV_CREDENTIALS.admin.fullName,
            role: 'ADMIN',
            isActive: true,
        },
    });

    console.log('✅ Created/Updated admin user:', adminUser.nik);

    // Create test user with hashed password
    const testUser = await prisma.user.upsert({
        where: { nik: DEV_CREDENTIALS.user.nik },
        update: {
            password: userHashedPassword, // Update password if user exists
        },
        create: {
            nik: DEV_CREDENTIALS.user.nik,
            email: DEV_CREDENTIALS.user.email,
            password: userHashedPassword,
            fullName: DEV_CREDENTIALS.user.fullName,
            role: 'USER',
            isActive: true,
        },
    });

    console.log('✅ Created/Updated test user:', testUser.nik);

    console.log('');
    console.log('🔐 DEV-ONLY Credentials (passwords are hashed in DB):');
    console.log(`   Admin: NIK=${DEV_CREDENTIALS.admin.nik}, Password=${DEV_CREDENTIALS.admin.password}`);
    console.log(`   User:  NIK=${DEV_CREDENTIALS.user.nik}, Password=${DEV_CREDENTIALS.user.password}`);
    console.log('');
    console.log('🎉 Database seeding completed!');
}

main()
    .catch((e) => {
        console.error('❌ Seeding error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
