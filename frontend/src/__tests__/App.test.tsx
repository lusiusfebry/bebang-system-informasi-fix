import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from '../App';
import { BrowserRouter } from 'react-router-dom';

// Mock useAuth
vi.mock('../contexts/AuthContext', () => ({
    useAuth: () => ({
        isLoading: false,
        isAuthenticated: false,
        user: null
    })
}));

describe('App', () => {
    it('renders without crashing', () => {
        render(
            <BrowserRouter>
                <App />
            </BrowserRouter>
        );
        expect(document.body).toBeDefined();
    });
});
