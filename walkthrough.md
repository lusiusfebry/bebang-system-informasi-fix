# Employee Resignation & Termination Management Walkthrough

This document outlines the implementation of the Employee Resignation and Termination Management system.

## Features Implemented

1.  **Backend (API)**
    *   **Database Schema**: Added `Resignation` model to `schema.prisma` with relation to `Karyawan`.
    *   **Migration**: Applied migration `add_resignation_model`.
    *   **Service Layer**: `ResignationService` handling creation, listing (with pagination/filtering), and status updates.
        *   **Approval Logic**: Transactionally updates resignation status AND employee status (sets `tanggalBerhenti` and inactivates employee).
    *   **Controller Layer**: `ResignationController` exposing endpoints for CRUD and Approve/Reject actions.
    *   **Authorization**: Secured routes for `ADMIN` and `HR_MANAGER`.
    *   **Route Registration**: Added `/api/hr/resignations` to main application routes.

2.  **Frontend (UI)**
    *   **Types & Service**: Defined TypeScript interfaces and API service integration.
    *   **Resignation List Page**:
        *   Data table with pagination and filtering (status, search).
        *   Status badges for visual clarity.
        *   Action buttons for Approval and Rejection (with reason prompt).
    *   **Resignation Form**:
        *   Modal for submitting new resignation/termination requests.
        *   Dropdown to select employee (from existing database).
        *   Fields for type (Resign/Terminate/etc), effective date, reason.
    *   **Navigation**:
        *   Added "Resign & Terminasi" card to `HRDashboard`.
        *   Configured routing in `HRModule`.

## Verification Results

### Frontend Verification
*   **Linting**: Passed with 0 errors.
*   **Component Structure**: Verified `ResignationList`, `ResignationForm`, and module integration.

### Backend Verification
*   **TypeScript Check**: Fixed import and type issues in `resignation.service.ts`.
*   **Schema**: Verified `schema.prisma` relations (removed duplicates).

## Usage Guide

1.  **Navigate to HR Module**: Go to the HR Dashboard.
2.  **Access Resignations**: Click on the new "Resign & Terminasi" card.
3.  **Create Request**: Click "Buat Pengajuan", select an employee, type, and date.
4.  **Manage Requests**:
    *   **Approve**: changing status to `APPROVED` will automatically set the employee's `tanggalBerhenti`.
    *   **Reject**: requires a reason note.

## Files Created/Modified

*   `backend/prisma/schema.prisma`
*   `backend/src/services/resignation.service.ts`
*   `backend/src/controllers/resignation.controller.ts`
*   `backend/src/routes/resignation.routes.ts`
*   `backend/src/index.ts`
*   `frontend/src/types/resignation.types.ts`
*   `frontend/src/services/resignation.service.ts`
*   `frontend/src/pages/hr/resignations/ResignationList.tsx`
*   `frontend/src/pages/hr/resignations/ResignationForm.tsx`
*   `frontend/src/pages/modules/HRModule.tsx`
*   `frontend/src/pages/hr/HRDashboard.tsx`
