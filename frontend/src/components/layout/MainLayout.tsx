import { useState } from 'react';
import TopNavBar from './TopNavBar';
import Sidebar from './Sidebar';
import Footer from './Footer';

interface MainLayoutProps {
    children: React.ReactNode;
    onSearchChange?: (query: string) => void;
}

export default function MainLayout({ children, onSearchChange }: MainLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Top Navigation Bar */}
            <TopNavBar
                onSearchChange={onSearchChange}
                onMenuClick={() => setIsSidebarOpen(true)}
            />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

                {/* Main Content + Footer */}
                <div className="flex flex-1 flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6 md:p-8">
                        {children}
                    </main>
                    <Footer />
                </div>
            </div>
        </div>
    );
}

