import TopNavBar from './TopNavBar';
import Footer from './Footer';

interface LandingLayoutProps {
    children: React.ReactNode;
    onSearchChange?: (query: string) => void;
}

export default function LandingLayout({ children, onSearchChange }: LandingLayoutProps) {
    return (
        <div className="flex h-screen w-full flex-col overflow-hidden bg-background-light dark:bg-background-dark">
            {/* Top Navigation Bar - No Sidebar Toggle functionality needed */}
            <TopNavBar
                onSearchChange={onSearchChange}
                // Pass empty function or hide menu button in TopNavBar if possible
                // For now, we keep it but it won't open anything since there is no sidebar
                onMenuClick={() => { }}
                hideMenuButton={true}
                hideSearch={true}
            />

            {/* Main Content Area */}
            <div className="flex flex-1 overflow-hidden">
                {/* No Sidebar here */}

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
