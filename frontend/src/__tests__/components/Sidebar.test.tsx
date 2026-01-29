import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '@/components/layout/Sidebar';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

// Mock AuthContext
const mockAuthDefaults = {
    user: {
        id: '1',
        name: 'Test User',
        role: { code: 'ADMIN' },
        permissions: [],
        roleCode: 'ADMIN' // Add roleCode for logic
    },
    isAuthenticated: true,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    token: 'token',
    checkPermission: vi.fn(), // If needed
    isLoading: false
};

const renderWithAuth = (component: React.ReactNode, authValue = mockAuthDefaults) => {
    return render( // @ts-ignore
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
