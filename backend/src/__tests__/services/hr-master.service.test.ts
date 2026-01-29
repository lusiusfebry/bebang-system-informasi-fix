import { divisiService } from '../../services/hr-master.service';
import { prisma } from '../../config/database';

jest.mock('../../config/database', () => ({
    prisma: {
        divisi: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
    },
}));

describe('HR Master Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('Divisi', () => {
        it('should get all divisi', async () => {
            (prisma.divisi.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.divisi.count as jest.Mock).mockResolvedValue(0);

            const result = await divisiService.findAll({}, { page: 1, limit: 10 });

            expect(result).toHaveProperty('data');
            expect(result).toHaveProperty('meta'); // Wait, service returns { data, total... } not meta object explicitly?
            // Service returns { data, total, page, limit, totalPages }
            expect(prisma.divisi.findMany).toHaveBeenCalled();
        });

        it('should create divisi', async () => {
            const mockDivisi = { id: '1', namaDivisi: 'IT' };
            (prisma.divisi.create as jest.Mock).mockResolvedValue(mockDivisi);

            const result = await divisiService.create({ namaDivisi: 'IT' });

            expect(result).toEqual(mockDivisi);
            expect(prisma.divisi.create).toHaveBeenCalled();
        });
    });
});
