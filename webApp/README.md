# Near East University Bus Tracker

A comprehensive web application for managing and tracking university buses in real-time. This system provides administrators with complete control over bus operations, drivers, routes, and schedules, while offering users an intuitive interface to discover routes and track buses in real-time.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Setup your environment](#setup-your-environment)
- [Database](#database)
- [API Documentation](#API-documentation)
- [Authentication & Security](#authentication--security)


## Overview

The Bus Tracker system is designed to streamline university transportation management. It enables administrators to manage drivers, buses, routes, and schedules efficiently, while providing real-time tracking capabilities for students and staff. The application is built with a modern tech stack ensuring scalability, security, and excellent user experience.

## Features

### Administrator Capabilities
- **Driver Management** - Complete CRUD operations for driver profiles and assignments
- **Bus Fleet Management** - Manage vehicle inventory, capacity, and operational status
- **Route Configuration** - Define and maintain bus routes with stations and distances
- **Station Management** - Manage pickup and drop-off locations across campus
- **Schedule Management** - Create and manage bus schedules with departure and arrival times
- **Administrative Dashboard** - Centralized view of all system operations and analytics

### User Capabilities
- **Route Discovery** - Browse all available bus routes and schedules
- **Real-time Bus Tracking** - Track active buses and their current locations
- **Secure Authentication** - JWT-based authentication with role-based access
- **User Preferences** - Customize language and interface appearance
- **Account Management** - Secure password reset and account settings

### Security & Compliance
- **JWT Token Authentication** - Industry-standard token-based authentication
- **Role-Based Access Control** - Granular permission management for Admin and Driver roles
- **Secure Cookie Storage** - HTTP-only cookies prevent XSS attacks
- **Token Verification Middleware** - Automatic validation on all protected endpoints
- **Email-Based Password Recovery** - Secure password reset with token verification


## Technology Stack

### Frontend Architecture
- **React 18** - Modern UI library with hooks and functional components
- **TypeScript** - Static type checking for enhanced code reliability
- **Vite** - Lightning-fast build tool with Hot Module Replacement (HMR)
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **React Router v6** - Client-side routing and navigation
- **Axios** - Promise-based HTTP client for API communication
- **Heroicons** - Professional SVG icon library

### Backend Architecture
- **Node.js** - JavaScript runtime for server-side execution
- **Express.js** - Lightweight and flexible web application framework
- **TypeScript** - Type-safe backend development
- **MySQL** - Reliable relational database management system
- **JWT (JSON Web Tokens)** - Stateless authentication mechanism
- **Nodemailer** - SMTP-based email service for password recovery
- **Bcrypt** - Industry-standard password hashing algorithm

### Development Tools
- **Git** - Version control system
- **npm** - JavaScript package manager
- **ESLint & Prettier** - Code quality and formatting



### Setup your environment

Before you begin, ensure you have the following installed on your system:

- **Node.js** v16.0.0 or higher
- **npm** v7.0.0 or higher (or yarn)
- **MySQL** v12.0 or higher
- **Git** v2.0 or higher

## Database

### Schema Overview

#### Users Table
#### Drivers Table
#### Buses Table
#### Routes Table
#### Stations Table
#### Bus Schedules Table
#### Contributing

## API Documentation

### Authentication Endpoints (`/api/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **POST** | `/login` | ❌ | User login |
| **POST** | `/logout` | ❌ | User logout |
| **GET** | `/user-info` | ✅ | Get current user info |
| **POST** | `/forgot-password` | ❌ | Request password reset |
| **HEAD** | `/reset-password` | ✅ | Verify reset token |
| **PATCH** | `/reset-password` | ✅ | Submit new password |
| **PATCH** | `/set-password/:token` | ✅ | Set password (drivers) |

### Admin Endpoints (`/api/admin`)

#### Driver Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/driver/add` | Add new driver |
| **DELETE** | `/driver/remove` | Remove driver |
| **PATCH** | `/driver/update` | Update driver |
| **GET** | `/drivers/fetch` | Fetch all drivers |

#### Bus Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/bus/add` | Add new bus |
| **DELETE** | `/bus/remove` | Remove bus |
| **PATCH** | `/bus/update` | Update bus |
| **GET** | `/buses/fetch` | Fetch all buses |

#### Route Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/route/add` | Add new route |
| **DELETE** | `/route/remove` | Remove route |
| **PATCH** | `/route/update` | Update route |

#### Station Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/station/add` | Add new station |
| **DELETE** | `/station/remove` | Remove station |
| **PATCH** | `/station/update` | Update station |
| **GET** | `/stations/fetch` | Fetch all stations |

#### Schedule Management
| Method | Endpoint | Description |
|--------|----------|-------------|
| **POST** | `/schedule/add` | Add new schedule |
| **DELETE** | `/schedule/remove` | Remove schedule |
| **PATCH** | `/schedule/update` | Update schedule |
| **GET** | `/schedule/fetch` | Fetch all schedules |

### User Endpoints (`/api/user`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| **GET** | `/routes/all` | ❌ | View all routes |
| **GET** | `/routes/operating` | ❌ | View operating routes |
| **PATCH** | `/language` | ✅ | Change language |
| **PATCH** | `/appearance` | ✅ | Change appearance |
| **PATCH** | `/change-route` | ✅ | Change route (drivers) |
| **PATCH** | `/tracking` | ✅ | Start/Stop tracking |


## Authentication & Security

### JWT Authentication Flow

The application uses JWT (JSON Web Tokens) for stateless authentication:

1. **User Login**: User submits credentials to `/api/auth/login`
2. **Token Generation**: Backend validates credentials and generates a JWT token
3. **Cookie Storage**: Token is stored in an HTTP-only, secure cookie
4. **Automatic Transmission**: Token is automatically included in all subsequent requests
5. **Token Validation**: Middleware validates the token on protected endpoints
6. **Session Expiry**: Token expires after the configured duration (default: 7 days)

### Token Types and Purposes

| Token Type | Purpose | Expiry | Usage |
|-----------|---------|--------|-------|
| **loginToken** | General authentication | 1 hour | All authenticated operations |
| **resetPasswordToken** | Password reset | 20 minutes | Password reset flow only |
| **setPasswordToken** | Initial password setup | 20 minutes | Driver account setup |


### Security Measures

- **HTTP-Only Cookies**: Tokens stored in HTTP-only cookies prevent XSS attacks
- **Secure Flag**: Cookies transmitted only over HTTPS in production
- **Token Validation**: Every protected endpoint validates token before processing
- **Role-Based Access**: Endpoints enforce role-based permissions (Admin/Driver)
- **Password Hashing**: User passwords hashed with bcrypt (salt rounds: 10)
- **Email Verification**: Password reset requires email verification

### Protected Routes

All administrative routes require:
- Valid JWT token in cookie
- Admin role authorization
- Additional role-specific permissions

