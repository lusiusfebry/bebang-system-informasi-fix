import { employeeService } from '../../services/employee.service';
import { prisma } from '../../lib/prisma';

// Mock with correct model name
jest.mock('../../lib/prisma', () => ({
    prisma: {
        karyawan: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn(),
        },
        $transaction: jest.fn((callback) => callback(prisma)),
    },
}));

describe('Employee Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('findAll', () => {
        it('should return paginated employees', async () => {
            (prisma.karyawan.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.karyawan.count as jest.Mock).mockResolvedValue(0);

            const result = await employeeService.findAll({ page: 1, limit: 10, sortBy: 'namaLengkap', sortOrder: 'asc' });

            expect(result).toHaveProperty('data');
            expect(prisma.karyawan.findMany).toHaveBeenCalled();
        });
    });

    describe('create', () => {
        it('should create employee', async () => {
            const mockEmployee = { id: '1', namaLengkap: 'John Doe', nomorIndukKaryawan: '123' };
            const input = {
                namaLengkap: 'John Doe',
                nomorIndukKaryawan: '123',
                nomorHandphone: '08123456789'
            } as any;

            (prisma.karyawan.create as jest.Mock).mockResolvedValue(mockEmployee);
            (prisma.karyawan.create as jest.Mock).mockResolvedValue(mockEmployee); // ensure mock is set

            const result = await employeeService.create(input);

            expect(result).toEqual(mockEmployee);
        });
    });
});
