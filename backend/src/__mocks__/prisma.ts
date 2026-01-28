/**
 * Prisma Client Mock for Testing
 * Mocks all Prisma methods untuk unit testing tanpa database connection
 */

import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';

// Create a deep mock of PrismaClient
export const prismaMock = mockDeep<PrismaClient>() as unknown as DeepMockProxy<PrismaClient>;

// Mock the prisma import
jest.mock('../lib/prisma', () => ({
    __esModule: true,
    prisma: prismaMock,
    default: prismaMock,
}));

// Reset mocks before each test
beforeEach(() => {
    jest.clearAllMocks();
});
