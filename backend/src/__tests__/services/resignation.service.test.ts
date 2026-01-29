import { resignationService } from '../../services/resignation.service';
import { prisma } from '../../config/database';

jest.mock('../../config/database', () => ({
    prisma: {
        resignation: {
            create: jest.fn(),
            findMany: jest.fn(),
            count: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
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

            const result = await resignationService.create({ reason: 'Test' }, 'user-1');

            expect(result).toEqual(mockResignation);
            expect(prisma.resignation.create).toHaveBeenCalled();
        });
    });

    describe('approve', () => {
        it('should approve resignation', async () => {
            const mockResignation = { id: '1', status: 'APPROVED' };
            (prisma.resignation.findUnique as jest.Mock).mockResolvedValue({ id: '1', status: 'PENDING' });
            (prisma.resignation.update as jest.Mock).mockResolvedValue(mockResignation);

            const result = await resignationService.approve('1', 'approver-1');

            expect(result).toEqual(mockResignation);
        });
    });
});
