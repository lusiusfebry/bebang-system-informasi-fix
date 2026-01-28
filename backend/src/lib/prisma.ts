/**
 * Shared PrismaClient Singleton
 * Provides a single database connection instance across the application
 */

import { PrismaClient } from '@prisma/client';

// Avoid instantiating multiple PrismaClients in development
// See: https://www.prisma.io/docs/guides/database/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

declare global {
    // eslint-disable-next-line no-var
    var __prisma: PrismaClient | undefined;
}

export const prisma = globalThis.__prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
    globalThis.__prisma = prisma;
}

export default prisma;
