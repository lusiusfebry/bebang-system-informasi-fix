import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { login as authLogin, logout as authLogout, isAuthenticated as checkAuth, getProfile } from '../services/auth.service';
import { User } from '../types/auth';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (nik: string, password: string) => Promise<void>;
    logout: () => void;
    checkAuthStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setIsLoading(true);
        try {
            if (checkAuth()) {
                // Token exists, verify it's still valid by fetching profile
                try {
                    const profile = await getProfile();
                    setUser(profile);
                    setIsAuthenticated(true);
                } catch {
                    // Token invalid, clear auth completely
                    authLogout();
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                // No token - clear user state completely, do NOT trust cached user
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (nik: string, password: string) => {
        const response = await authLogin(nik, password);
        setUser(response.user);
        setIsAuthenticated(true);
    };

    const logout = () => {
        authLogout();
        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                isLoading,
                login,
                logout,
                checkAuthStatus,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
