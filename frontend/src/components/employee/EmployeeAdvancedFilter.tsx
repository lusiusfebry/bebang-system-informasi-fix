
import React, { useEffect, useState } from 'react';
import { EmployeeFilterState } from '../../types/employee.types';
import {
    divisiService,
    departmentService,
    statusKaryawanService,
    tagService,
    lokasiKerjaService
} from '../../services/hr-master.service';

interface Option {
    id: string;
    label: string;
}

interface EmployeeAdvancedFilterProps {
    onFilterChange: (filters: EmployeeFilterState) => void;
    initialFilters?: EmployeeFilterState;
}

export const EmployeeAdvancedFilter: React.FC<EmployeeAdvancedFilterProps> = ({
    onFilterChange,
    initialFilters
}) => {
    const [filters, setFilters] = useState<EmployeeFilterState>(initialFilters || {
        search: '',
        divisiId: '',
        departmentId: '',
        statusKaryawanId: '',
        tagId: '',
        lokasiKerjaId: ''
    });

    // Options state
    const [divisiOptions, setDivisiOptions] = useState<Option[]>([]);
    const [departmentOptions, setDepartmentOptions] = useState<Option[]>([]);
    const [statusOptions, setStatusOptions] = useState<Option[]>([]);
    const [tagOptions, setTagOptions] = useState<Option[]>([]);
    const [lokasiOptions, setLokasiOptions] = useState<Option[]>([]);

    useEffect(() => {
        const fetchOptions = async () => {
            try {
                const [divisi, dept, status, tags, lokasi] = await Promise.all([
                    divisiService.getAll(),
                    departmentService.getAll(),
                    statusKaryawanService.getAll(),
                    tagService.getAll(),
                    lokasiKerjaService.getAll()
                ]);

                setDivisiOptions(divisi.data.map((d: any) => ({ id: d.id, label: d.namaDivisi })));
                setDepartmentOptions(dept.data.map((d: any) => ({ id: d.id, label: d.namaDepartment })));
                setStatusOptions(status.data.map((s: any) => ({ id: s.id, label: s.namaStatus })));
                setTagOptions(tags.data.map((t: any) => ({ id: t.id, label: t.namaTag })));
                setLokasiOptions(lokasi.data.map((l: any) => ({ id: l.id, label: l.namaLokasiKerja })));
            } catch (error) {
                console.error('Failed to fetch filter options', error);
            }
        };

        fetchOptions();
    }, []);

    const handleChange = (key: keyof EmployeeFilterState, value: string) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        // Debounce search, but apply others immediately
        if (key !== 'search') {
            onFilterChange(newFilters);
        }
    };

    // Special handler for search with debounce check in parent or here? 
    // Usually standard to debounce here or let parent handle. 
    // Given the prompt simplified approach, let's provide a "Terapkan" button or just debounce search effect.
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (filters.search !== (initialFilters?.search || '')) {
                onFilterChange(filters);
            }
        }, 500);
        return () => clearTimeout(timeoutId);
    }, [filters.search]);

    const handleReset = () => {
        const emptyFilters = {
            search: '',
            divisiId: '',
            departmentId: '',
            statusKaryawanId: '',
            tagId: '',
            lokasiKerjaId: ''
        };
        setFilters(emptyFilters);
        onFilterChange(emptyFilters);
    };

    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Search - Full width on mobile */}
                <div className="md:col-span-2 lg:col-span-3">
                    <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Pencarian</label>
                    <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                            <span className="material-symbols-rounded text-lg">search</span>
                        </span>
                        <input
                            type="text"
                            placeholder="Cari nama, NIK, atau email..."
                            value={filters.search}
                            onChange={(e) => handleChange('search', e.target.value)}
                            className="w-full pl-10 h-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary text-sm"
                        />
                    </div>
                </div>

                {/* Filters */}
                <SelectFilter
                    label="Divisi"
                    value={filters.divisiId}
                    options={divisiOptions}
                    onChange={(val) => handleChange('divisiId', val)}
                />
                <SelectFilter
                    label="Department"
                    value={filters.departmentId}
                    options={departmentOptions}
                    onChange={(val) => handleChange('departmentId', val)}
                />
                <SelectFilter
                    label="Status Karyawan"
                    value={filters.statusKaryawanId}
                    options={statusOptions}
                    onChange={(val) => handleChange('statusKaryawanId', val)}
                />
                <SelectFilter
                    label="Lokasi Kerja"
                    value={filters.lokasiKerjaId}
                    options={lokasiOptions}
                    onChange={(val) => handleChange('lokasiKerjaId', val)}
                />
                <SelectFilter
                    label="Tag"
                    value={filters.tagId}
                    options={tagOptions}
                    onChange={(val) => handleChange('tagId', val)}
                />

                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="h-10 px-4 py-2 w-full text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                        <span className="material-symbols-rounded text-lg">filter_alt_off</span>
                        Reset Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

const SelectFilter: React.FC<{
    label: string;
    value: string;
    options: Option[];
    onChange: (val: string) => void;
}> = ({ label, value, options, onChange }) => (
    <div>
        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full h-10 rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:ring-primary focus:border-primary text-sm"
        >
            <option value="">Semua {label}</option>
            {options.map((opt) => (
                <option key={opt.id} value={opt.id}>{opt.label}</option>
            ))}
        </select>
    </div>
);
