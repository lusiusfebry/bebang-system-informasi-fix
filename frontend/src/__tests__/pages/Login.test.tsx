import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Login from '../../pages/Login';
import { BrowserRouter } from 'react-router-dom';
import { AuthContext } from '@/contexts/AuthContext';

// Mock usages
vi.mock('@/services/auth.service', () => ({
    authService: {
        login: vi.fn(),
        getProfile: vi.fn(),
    }
}));

// Mock AuthContext
const mockAuthDefaults = {
    user: null,
    isAuthenticated: false,
    login: vi.fn(),
    logout: vi.fn(),
    loading: false,
    token: null
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

describe('Login Page', () => {
    it('renders login form', () => {
        renderWithAuth(<Login />);
        expect(screen.getByLabelText(/Nomor Induk Karyawan \(NIK\)/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Kata Sandi/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Masuk ke Dashboard/i })).toBeInTheDocument();
    });

    it('handles input changes', () => {
        renderWithAuth(<Login />);
        const nikInput = screen.getByLabelText(/Nomor Induk Karyawan \(NIK\)/i);
        fireEvent.change(nikInput, { target: { value: '123456' } });
        expect(nikInput).toHaveValue('123456');
    });

    // More complex interaction tests would require mocking hooks/services more deeply
});
