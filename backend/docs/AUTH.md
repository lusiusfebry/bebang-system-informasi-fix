# Authentication API Documentation

## Overview

Bebang Sistem Informasi menggunakan JWT (JSON Web Token) untuk autentikasi. Token memiliki masa berlaku 24 jam (dapat diubah via environment variable).

## Endpoints

### POST `/api/auth/login`

Login user dan mendapatkan JWT token.

**Request Body:**
```json
{
    "nik": "string (required)",
    "password": "string (required)"
}
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "user": {
            "id": "uuid",
            "nik": "DEV_ADMIN",
            "email": "dev.admin@bebang.local",
            "fullName": "Development Administrator",
            "role": "ADMIN",
            "isActive": true,
            "createdAt": "2024-01-01T00:00:00.000Z",
            "updatedAt": "2024-01-01T00:00:00.000Z"
        }
    },
    "message": "Login berhasil"
}
```

**Error Responses:**
| Status | Message | Description |
|--------|---------|-------------|
| 400 | NIK wajib diisi | NIK tidak diisi |
| 400 | Password wajib diisi | Password tidak diisi |
| 401 | NIK atau password salah | Credentials tidak valid |
| 403 | Akun tidak aktif | User dengan isActive = false |

---

### GET `/api/auth/profile`

Mendapatkan profil user yang sedang login.

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
    "success": true,
    "data": {
        "id": "uuid",
        "nik": "DEV_ADMIN",
        "email": "dev.admin@bebang.local",
        "fullName": "Development Administrator",
        "role": "ADMIN",
        "isActive": true,
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
    }
}
```

**Error Responses:**
| Status | Message | Description |
|--------|---------|-------------|
| 401 | Token tidak ditemukan | Header Authorization tidak ada |
| 401 | Token tidak valid atau sudah kadaluarsa | Token invalid/expired |

---

### POST `/api/auth/logout`

Logout user (mainly for logging purposes, actual token removal is client-side).

**Headers:**
```
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
    "success": true,
    "data": null,
    "message": "Logout berhasil"
}
```

---

## JWT Token Structure

**Header:**
```json
{
    "alg": "HS256",
    "typ": "JWT"
}
```

**Payload:**
```json
{
    "userId": "uuid",
    "nik": "DEV_ADMIN",
    "role": "ADMIN",
    "iat": 1704067200,
    "exp": 1704153600
}
```

---

## User Roles

| Role | Description |
|------|-------------|
| `ADMIN` | Full system access |
| `HR_MANAGER` | HR module access |
| `USER` | Standard user access |
| `VIEWER` | Read-only access |

---

## Development Credentials

> ⚠️ **WARNING:** These credentials are for development only!

| Role | NIK | Password |
|------|-----|----------|
| Admin | `DEV_ADMIN` | `DevAdmin@2024!` |
| User | `DEV_USER` | `DevUser@2024!` |

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | Secret key for signing JWT | (required in production) |
| `JWT_EXPIRES_IN` | Token expiration time | `24h` |

---

## Frontend Integration

### Login Flow
```typescript
import { login } from './services/auth.service';

// Login
const { token, user } = await login(nik, password);
// Token is automatically stored in localStorage

// All subsequent API calls will include the token
// via axios interceptor (Authorization: Bearer <token>)
```

### Protected Routes
```tsx
import { useAuth } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Wrap routes that require authentication
<Route
    path="/"
    element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    }
/>
```

### Logout
```typescript
import { useAuth } from './contexts/AuthContext';

const { logout } = useAuth();
logout(); // Clears token and redirects to /login
```
