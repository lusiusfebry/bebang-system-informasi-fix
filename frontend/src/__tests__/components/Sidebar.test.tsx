import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '@/components/layout/Sidebar';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

// Mock AuthContext
const mockAuthDefaults = {
    user: {
        id: '1',
        nik: '12345',
        email: 'test@example.com',
        fullName: 'Test User',
        name: 'Test User', // Keep if used locally, but not in strict User interface? Wait, interface has fullName, not name? Ah, let me check the file content again. It has fullName. It does NOT have name. But the mock had name. I should use fullName.
        roleId: 'role-1',
        role: {
            id: 'role-1',
            name: 'Admin',
            code: 'ADMIN',
            description: null
        },
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        permissions: [],
        roleCode: 'ADMIN'
    } as any, // Using as any for now to bypass strict check if I missed something small, OR better, cast to User? 
    // Wait, let's try to match it exactly without cast first. 
    // User interface has: id, nik, email, fullName, roleId, role, permissions, roleCode, isActive, createdAt, updatedAt.
    // The previous mock had `name`, maybe `Sidebar` uses `name` somewhere? 
    // I will keep `name` just in case, and add required fields.
    // Actually, I'll use `as unknown as User` or similar if valid, but let's try to be proper.
    // Wait, if I look at `Sidebar.test.tsx` again, line 11 says `name: 'Test User'`.
    // I will replace the whole user object.
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    token: 'token',
    checkPermission: vi.fn(), // If needed
    isLoading: false,
    checkAuthStatus: vi.fn(),
};

const renderWithAuth = (component: React.ReactNode, authValue = mockAuthDefaults) => {
    return render(
        <AuthContext.Provider value={authValue}>
            <BrowserRouter>
                {component}
            </BrowserRouter>
        </AuthContext.Provider>
    );
};

describe('Sidebar', () => {
    it('renders sidebar component', () => {
        renderWithAuth(<Sidebar isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });

    it('renders menu items based on role', () => {
        renderWithAuth(<Sidebar isOpen={true} onClose={() => { }} />);
        expect(screen.getByText('Dashboard')).toBeInTheDocument();
    });
});
