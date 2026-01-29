/**
 * HRModule Component
 * Main component untuk HR module dengan nested routing
 */

import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../../components/layout/MainLayout';

// Dashboard
import HRDashboard from '../hr/HRDashboard';

// Employee Pages
import { EmployeeProfile } from '../hr/employees';
import EmployeeImport from '../hr/employees/EmployeeImport';
import EmployeeList from '../hr/employees/EmployeeList';

// Resignation Pages
import ResignationList from '../hr/resignations/ResignationList';

// Master Data Pages
import DivisiList from '../hr/master-data/DivisiList';
import DepartmentList from '../hr/master-data/DepartmentList';
import PosisiJabatanList from '../hr/master-data/PosisiJabatanList';
import KategoriPangkatList from '../hr/master-data/KategoriPangkatList';
import GolonganList from '../hr/master-data/GolonganList';
import SubGolonganList from '../hr/master-data/SubGolonganList';
import JenisHubunganKerjaList from '../hr/master-data/JenisHubunganKerjaList';
import TagList from '../hr/master-data/TagList';
import LokasiKerjaList from '../hr/master-data/LokasiKerjaList';
import StatusKaryawanList from '../hr/master-data/StatusKaryawanList';

export default function HRModule() {
    return (
        <MainLayout>
            <Routes>
                {/* Dashboard */}
                <Route index element={<HRDashboard />} />
                <Route path="dashboard" element={<HRDashboard />} />

                {/* Employee Routes */}
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/import" element={<EmployeeImport />} />
                <Route path="employees/:id" element={<EmployeeProfile />} />
                <Route path="employees/:id/:tab" element={<EmployeeProfile />} />

                {/* Resignation Routes */}
                <Route path="resignations" element={<ResignationList />} />

                {/* Master Data Routes */}
                <Route path="master-data/divisi" element={<DivisiList />} />
                <Route path="master-data/department" element={<DepartmentList />} />
                <Route path="master-data/posisi-jabatan" element={<PosisiJabatanList />} />
                <Route path="master-data/kategori-pangkat" element={<KategoriPangkatList />} />
                <Route path="master-data/golongan" element={<GolonganList />} />
                <Route path="master-data/sub-golongan" element={<SubGolonganList />} />
                <Route path="master-data/jenis-hubungan-kerja" element={<JenisHubunganKerjaList />} />
                <Route path="master-data/tag" element={<TagList />} />
                <Route path="master-data/lokasi-kerja" element={<LokasiKerjaList />} />
                <Route path="master-data/status-karyawan" element={<StatusKaryawanList />} />

                {/* Catch-all redirect to dashboard */}
                <Route path="*" element={<Navigate to="/hr" replace />} />
            </Routes>
        </MainLayout>
    );
}
