import { useNavigate } from 'react-router-dom';

export default function Welcome() {
    const navigate = useNavigate();

    const modules = [
        {
            id: 'hr',
            name: 'Human Resources',
            description: 'Kelola data karyawan, absensi, dan struktur organisasi',
            icon: 'group',
            color: 'bg-blue-500',
            path: '/hr',
        },
        {
            id: 'inventory',
            name: 'Inventory',
            description: 'Kelola aset dan inventaris perusahaan',
            icon: 'inventory_2',
            color: 'bg-green-500',
            path: '/inventory',
            comingSoon: true,
        },
        {
            id: 'mess',
            name: 'Mess Management',
            description: 'Kelola pengelolaan mess dan akomodasi',
            icon: 'home_work',
            color: 'bg-orange-500',
            path: '/mess',
            comingSoon: true,
        },
        {
            id: 'reports',
            name: 'Reports',
            description: 'Lihat laporan dan statistik',
            icon: 'analytics',
            color: 'bg-purple-500',
            path: '/reports',
            comingSoon: true,
        },
    ];

    return (
        <div className="min-h-screen bg-background-light dark:bg-background-dark">
            {/* Header */}
            <header className="bg-white dark:bg-surface-dark shadow-soft">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="material-symbols-outlined text-white">apartment</span>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-text-light dark:text-text-dark">
                                    {import.meta.env.VITE_APP_NAME || 'Bebang Sistem Informasi'}
                                </h1>
                                <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise Portal</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">notifications</span>
                            </button>
                            <button
                                onClick={() => navigate('/login')}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                            >
                                <span className="material-symbols-outlined text-gray-600 dark:text-gray-300">account_circle</span>
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Admin</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-text-light dark:text-text-dark mb-2">
                        Selamat Datang! 👋
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        Pilih modul yang ingin Anda akses untuk memulai.
                    </p>
                </div>

                {/* Module Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {modules.map((module) => (
                        <div
                            key={module.id}
                            onClick={() => !module.comingSoon && navigate(module.path)}
                            className={`card cursor-pointer hover:shadow-medium transition-all duration-300 transform hover:-translate-y-1 ${module.comingSoon ? 'opacity-60' : ''
                                }`}
                        >
                            <div className="relative">
                                {module.comingSoon && (
                                    <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium rounded-full">
                                        Segera Hadir
                                    </span>
                                )}
                                <div className={`w-12 h-12 ${module.color} rounded-xl flex items-center justify-center mb-4`}>
                                    <span className="material-symbols-outlined text-white text-2xl">{module.icon}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-2">
                                    {module.name}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">{module.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Quick Stats */}
                <div className="mt-12">
                    <h3 className="text-lg font-semibold text-text-light dark:text-text-dark mb-4">
                        Ringkasan Statistik
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-blue-600 dark:text-blue-400">group</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">0</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Karyawan</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600 dark:text-green-400">inventory_2</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">0</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Total Inventaris</p>
                                </div>
                            </div>
                        </div>
                        <div className="card">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                                    <span className="material-symbols-outlined text-purple-600 dark:text-purple-400">trending_up</span>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">-</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status Sistem</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                <p>© 2024 Bebang Sistem Informasi. All rights reserved.</p>
            </footer>
        </div>
    );
}
