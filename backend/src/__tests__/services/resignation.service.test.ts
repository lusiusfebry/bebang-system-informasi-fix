import { resignationService } from '../../services/resignation.service';
import { prisma } from '../../config/database';
import { ResignationType } from '@prisma/client';

jest.mock('../../config/database', () => ({
    prisma: {
        resignation: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
        statusKaryawan: {
            findFirst: jest.fn(),
        },
        karyawan: {
            update: jest.fn(),
        },
        $transaction: jest.fn(),
    },
}));

describe('Resignation Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('create', () => {
        it('should create resignation', async () => {
            const mockResignation = { id: '1', reason: 'Test' };
            (prisma.resignation.create as jest.Mock).mockResolvedValue(mockResignation);

            const result = await resignationService.create({
                reason: 'Test',
                karyawanId: 'user-1',
                type: ResignationType.RESIGNATION,
                effectiveDate: '2025-01-01'
            });

            expect(result).toEqual(mockResignation);
            expect(prisma.resignation.create).toHaveBeenCalled();
        });
    });

    describe('updateStatus', () => {
        it('should approve resignation', async () => {
            const mockResignation = { id: '1', status: 'APPROVED' };
            (prisma.resignation.findUnique as jest.Mock).mockResolvedValue({ id: '1', status: 'PENDING', karyawanId: 'emp-1' });
            // Mock transaction
            (prisma.$transaction as jest.Mock).mockImplementation(async (cb) => cb(prisma));

            // Mock StatusKaryawan findFirst and Karyawan update
            const mockTx = prisma as any; // Reuse prisma as tx
            mockTx.statusKaryawan = { findFirst: jest.fn() };
            (mockTx.statusKaryawan.findFirst as jest.Mock).mockResolvedValue({ id: 'so-id' });
            mockTx.karyawan = { update: jest.fn() };

            (prisma.resignation.update as jest.Mock).mockResolvedValue(mockResignation);

            const result = await resignationService.updateStatus('1', 'APPROVED', 'approver-1');

            expect(result).toEqual(mockResignation);
        });
    });
});
