# HR Module

## Overview

The HR Module manages human resources functions including:
- Employee data management
- Attendance tracking
- Organization structure
- Leave management
- Performance reviews

## Features

### Employee Management
- Create, read, update, delete employee records
- Employee profiles with personal and work information
- Document management (contracts, certifications)

### Attendance
- Clock in/out tracking
- Attendance reports
- Overtime calculation

### Organization Structure
- Department management
- Position hierarchy
- Reporting relationships

## API Endpoints

### Employees
- `GET /api/hr/employees` - List all employees
- `GET /api/hr/employees/:id` - Get employee by ID
- `POST /api/hr/employees` - Create new employee
- `PUT /api/hr/employees/:id` - Update employee
- `DELETE /api/hr/employees/:id` - Delete employee

### Departments
- `GET /api/hr/departments` - List all departments
- `POST /api/hr/departments` - Create department
- `PUT /api/hr/departments/:id` - Update department
- `DELETE /api/hr/departments/:id` - Delete department

## Database Schema

See `database/schema.md` for detailed database schema.

## Status

🚧 **In Development**
