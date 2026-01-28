import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import MainLayout from '../components/layout/MainLayout';
import ModuleCard from '../components/ModuleCard';

interface Module {
    id: string;
    name: string;
    description: string;
    icon: string;
    path: string;
    isHighlighted?: boolean;
    comingSoon?: boolean;
    isDashed?: boolean;
}

const modules: Module[] = [
    {
        id: 'hr',
        name: 'Human Resources',
        description: 'Kelola data karyawan, absensi, cuti, dan struktur organisasi perusahaan',
        icon: 'groups',
        path: '/hr',
        isHighlighted: true,
    },
    {
        id: 'inventory',
        name: 'Inventory',
        description: 'Kelola aset, peralatan, dan inventaris perusahaan',
        icon: 'inventory_2',
        path: '/inventory',
        comingSoon: true,
    },
    {
        id: 'mess',
        name: 'Mess Management',
        description: 'Kelola pengelolaan mess, katering, dan akomodasi karyawan',
        icon: 'restaurant',
        path: '/mess',
        comingSoon: true,
    },
    {
        id: 'building',
        name: 'Building Management',
        description: 'Kelola gedung, fasilitas, dan maintenance perusahaan',
        icon: 'domain',
        path: '/building',
        comingSoon: true,
    },
    {
        id: 'access-rights',
        name: 'Access Rights',
        description: 'Kelola hak akses, roles, dan permissions pengguna sistem',
        icon: 'admin_panel_settings',
        path: '/access-rights',
        comingSoon: true,
    },
    {
        id: 'request-module',
        name: 'Request New Module',
        description: 'Ajukan permintaan untuk modul baru yang dibutuhkan',
        icon: 'add_circle',
        path: '/request-module',
        isDashed: true,
    },
];

export default function Welcome() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');

    const filteredModules = useMemo(() => {
        if (!searchQuery.trim()) return modules;
        const query = searchQuery.toLowerCase();
        return modules.filter(
            (module) =>
                module.name.toLowerCase().includes(query) ||
                module.description.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    const handleModuleClick = (module: Module) => {
        if (!module.comingSoon) {
            navigate(module.path);
        }
    };

    return (
        <MainLayout onSearchChange={setSearchQuery}>
            {/* Page Heading */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
                    Selamat Datang Kembali, {user?.fullName?.split(' ')[0] || 'User'}!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                    Pilih modul untuk mengelola layanan data enterprise Anda hari ini.
                </p>
            </div>

            {/* Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {filteredModules.map((module) => (
                    <ModuleCard
                        key={module.id}
                        id={module.id}
                        name={module.name}
                        description={module.description}
                        icon={module.icon}
                        isHighlighted={module.isHighlighted}
                        comingSoon={module.comingSoon}
                        isDashed={module.isDashed}
                        onClick={() => handleModuleClick(module)}
                    />
                ))}
            </div>

            {/* No Results */}
            {filteredModules.length === 0 && (
                <div className="text-center py-12">
                    <span className="material-symbols-outlined text-5xl text-gray-300 dark:text-gray-600 mb-4">
                        search_off
                    </span>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                        Tidak ada modul yang cocok dengan pencarian "{searchQuery}"
                    </p>
                </div>
            )}

            {/* Support Panel */}
            <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 md:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-primary text-3xl">support_agent</span>
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            Butuh Bantuan?
                        </h2>
                        <p className="text-gray-600 dark:text-gray-400">
                            Tim IT Support kami siap membantu Anda. Hubungi kami untuk pertanyaan teknis atau panduan penggunaan sistem.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                        <button className="px-6 py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">call</span>
                            Hubungi Support
                        </button>
                        <button className="px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 font-semibold rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-lg">menu_book</span>
                            Lihat Dokumentasi
                        </button>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
