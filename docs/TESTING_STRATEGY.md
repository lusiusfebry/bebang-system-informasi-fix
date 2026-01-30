# Strategi & Panduan Testing

## 1. Backend Testing
Kami menggunakan **Jest** sebagai framework testing utama.

### Jenis Test
- **Unit Testing**: Menguji controller dan service secara terisolasi. Gunakan `jest-mock-extended` untuk mocking dependencies.
- **Integration Testing**: Menguji API endpoints menggunakan `supertest`.

### Perintah
```bash
# Menjalankan semua test
npm test

# Menjalankan test coverage
npm run test:coverage
```

### Panduan Penulisan Test
- Pastikan setiap Route memiliki integration test.
- Mock external services (Database, Email, Excel Service).
- Gunakan factory pattern/helper untuk data test.

## 2. Frontend Testing
Kami menggunakan **Vitest** dan **React Testing Library**.

### Jenis Test
- **Component Testing**: Menguji rendering komponen dan interaksi user (klik, input).
- **Unit Testing**: Menguji fungsi utility dan hooks.

### Perintah
```bash
# Menjalankan test
npm test
```

### Panduan Penulisan Test
- Fokus pada *User Behavior* (apa yang dilihat/dilakukan user), bukan implementasi internal.
- Gunakan `screen` untuk query elemen (misal `screen.getByRole`).
- Mock API calls menggunakan `vi.mock`.

## 3. End-to-End (E2E) Testing
Kami menggunakan **Playwright** untuk simulasi flow user lengkap.

### Skenario Kritis
1. Login & Logout
2. CRUD Karyawan
3. Import Data Excel
4. Manajemen Data Master

### Perintah
```bash
# Menjalankan E2E test
npx playwright test
```
