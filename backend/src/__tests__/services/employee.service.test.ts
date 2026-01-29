import { employeeService } from '../../services/employee.service';
import { prisma } from '../../config/database';

jest.mock('../../config/database', () => ({
    prisma: {
        employee: {
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

    describe('getAllEmployees', () => {
        it('should return paginated employees', async () => {
            (prisma.employee.findMany as jest.Mock).mockResolvedValue([]);
            (prisma.employee.count as jest.Mock).mockResolvedValue(0);

            const result = await employeeService.getAllEmployees({ page: 1, limit: 10 });

            expect(result).toHaveProperty('data');
            expect(prisma.employee.findMany).toHaveBeenCalled();
        });
    });

    describe('createEmployee', () => {
        it('should create employee', async () => {
            const mockEmployee = { id: '1', fullName: 'John Doe', nik: '123' };
            const input = {
                personalInfo: { fullName: 'John Doe', nik: '123' } as any,
                hrInfo: {} as any,
                familyInfo: []
            };

            (prisma.employee.create as jest.Mock).mockResolvedValue(mockEmployee);
            (prisma.employee.findUnique as jest.Mock).mockResolvedValue(null);

            const result = await employeeService.createEmployee(input, 'user-1');

            expect(result).toEqual(mockEmployee);
        });
    });
});
