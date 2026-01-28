import MainLayout from '../components/layout/MainLayout';

interface PlaceholderPageProps {
    title: string;
    description: string;
    icon: string;
    color: string;
}

export default function PlaceholderPage({ title, description, icon, color }: PlaceholderPageProps) {
    return (
        <MainLayout>
            <nav className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-6">
                <a href="/" className="hover:text-primary transition-colors">Home</a>
                <span className="material-symbols-outlined text-xs">chevron_right</span>
                <span className="text-gray-900 dark:text-white font-medium">{title}</span>
            </nav>

            <div className="flex items-center gap-4 mb-8">
                <div className={`w-14 h-14 ${color} rounded-xl flex items-center justify-center`}>
                    <span className="material-symbols-outlined text-white text-3xl">{icon}</span>
                </div>
                <div>
                    <h1 className="text-3xl font-black text-gray-900 dark:text-white">{title}</h1>
                    <p className="text-gray-600 dark:text-gray-400">{description}</p>
                </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
                <div className="flex items-start gap-4">
                    <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-2xl">construction</span>
                    <div>
                        <h3 className="font-semibold text-amber-800 dark:text-amber-300 mb-1">Dalam Pengembangan</h3>
                        <p className="text-amber-700 dark:text-amber-400 text-sm">
                            Halaman {title} sedang dalam tahap pengembangan dan akan segera tersedia.
                        </p>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}

// Pre-configured placeholder pages
export function ActivitiesPage() {
    return (
        <PlaceholderPage
            title="Recent Activities"
            description="Lihat aktivitas terbaru di sistem"
            icon="history"
            color="bg-blue-500"
        />
    );
}

export function ProfilePage() {
    return (
        <PlaceholderPage
            title="My Profile"
            description="Kelola profil dan pengaturan akun"
            icon="person"
            color="bg-indigo-500"
        />
    );
}

export function MessagesPage() {
    return (
        <PlaceholderPage
            title="Messages"
            description="Kelola pesan dan notifikasi"
            icon="chat_bubble"
            color="bg-green-500"
        />
    );
}

export function HelpPage() {
    return (
        <PlaceholderPage
            title="Help Desk"
            description="Bantuan dan dokumentasi sistem"
            icon="help_center"
            color="bg-teal-500"
        />
    );
}

export function RequestModulePage() {
    return (
        <PlaceholderPage
            title="Request New Module"
            description="Ajukan permintaan untuk modul baru"
            icon="add_circle"
            color="bg-purple-500"
        />
    );
}

export function SettingsPage() {
    return (
        <PlaceholderPage
            title="Settings"
            description="Kelola pengaturan aplikasi dan preferensi"
            icon="settings"
            color="bg-gray-600"
        />
    );
}

