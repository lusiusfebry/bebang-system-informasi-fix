/**
 * useEmployee Hook
 * Custom hook for fetching and managing employee data
 */

import { useState, useEffect, useCallback } from 'react';
import { Employee } from '../types/employee.types';
import { employeeService } from '../services/employee.service';

interface UseEmployeeResult {
    employee: Employee | null;
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export const useEmployee = (employeeId: string | undefined): UseEmployeeResult => {
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchEmployee = useCallback(async () => {
        if (!employeeId) {
            setLoading(false);
            setError('Employee ID tidak valid');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const data = await employeeService.getEmployeeById(employeeId);
            setEmployee(data);
        } catch (err) {
            console.error('Error fetching employee:', err);
            setError('Gagal memuat data karyawan');
            setEmployee(null);
        } finally {
            setLoading(false);
        }
    }, [employeeId]);

    useEffect(() => {
        fetchEmployee();
    }, [fetchEmployee]);

    return {
        employee,
        loading,
        error,
        refetch: fetchEmployee,
    };
};

export default useEmployee;
