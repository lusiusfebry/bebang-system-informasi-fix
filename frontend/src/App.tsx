import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import Welcome from './pages/Welcome';
import ProtectedRoute from './components/ProtectedRoute';

// Module Imports
import HRModule from './pages/modules/HRModule';
import InventoryModule from './pages/modules/InventoryModule';
import MessModule from './pages/modules/MessModule';
import BuildingModule from './pages/modules/BuildingModule';
import AccessRightsModule from './pages/modules/AccessRightsModule';

// Placeholder Pages
import {
    ActivitiesPage,
    ProfilePage,
    MessagesPage,
    HelpPage,
    RequestModulePage,
    SettingsPage,
} from './pages/PlaceholderPage';

function App() {
    const { isLoading } = useAuth();

    // Show loading while checking auth
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-600 dark:text-gray-400">Memuat aplikasi...</p>
                </div>
            </div>
        );
    }

    return (
        <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes - Dashboard */}
            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Welcome />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Sidebar Pages */}
            <Route
                path="/activities"
                element={
                    <ProtectedRoute>
                        <ActivitiesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/messages"
                element={
                    <ProtectedRoute>
                        <MessagesPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/help"
                element={
                    <ProtectedRoute>
                        <HelpPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/request-module"
                element={
                    <ProtectedRoute>
                        <RequestModulePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/settings"
                element={
                    <ProtectedRoute>
                        <SettingsPage />
                    </ProtectedRoute>
                }
            />

            {/* Protected Routes - Modules */}
            <Route
                path="/hr/*"
                element={
                    <ProtectedRoute>
                        <HRModule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/inventory/*"
                element={
                    <ProtectedRoute>
                        <InventoryModule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/mess/*"
                element={
                    <ProtectedRoute>
                        <MessModule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/building/*"
                element={
                    <ProtectedRoute>
                        <BuildingModule />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/access-rights/*"
                element={
                    <ProtectedRoute>
                        <AccessRightsModule />
                    </ProtectedRoute>
                }
            />

            {/* Catch All */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;

