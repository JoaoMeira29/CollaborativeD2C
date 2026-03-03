# Collaborative Direct2Consumer — Authentication Module

Internship project developed at **Sistrade - Software Consulting, S.A.** as part of the Degree in Computer Systems Engineering at **IPCA - Polytechnic University of Cávado and Ave**.

## Overview

This project implements a **centralized authentication module** for the Collaborative Direct2Consumer (D2C) platform, part of a larger Textile and Clothing Industry R&D initiative.

The main goal is to eliminate repetitive authentication: once a user authenticates in the main system, they are automatically authenticated across all integrated external modules and services (e.g. virtual fitting room, e-commerce store, weather service).

## Tech Stack

| Layer | Technology |
|---|---|
| Backend API | Node.js + Express.js |
| Frontend | Angular |
| Database | Microsoft SQL Server (via Sequelize) |
| Authentication | JWT (JSON Web Tokens) + HTTP Cookies |

## Project Structure

```
├── API/
│   ├── controllers/       # Auth logic (login, register)
│   ├── middleware/        # JWT cookie verification, role authorization
│   ├── models/            # Sequelize data models
│   ├── routes/            # API route definitions
│   ├── services/          # User service (DB queries)
│   ├── utils/             # Enums and shared utilities
│   └── specsOpenAPI/      # OpenAPI specification
├── Frontend/              # Angular application (D2C portal)
├── app.js
├── config.js
├── sequelize.js
└── server.js
```

## Features

- User registration and login with JWT-based authentication
- Token stored in HTTP cookie and validated on every protected request
- Role-based authorization (Manager, User, etc.)
- User status validation (Active/Inactive) on login
- Angular route guards (`CanActivate`) to protect frontend pages
- Centralized auth enabling seamless SSO-like access to external services

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/collaborativeD2C/api/authLogin` | Authenticate a user |
| POST | `/collaborativeD2C/api/authRegister` | Register a new user |

## Getting Started

### Prerequisites

- Node.js
- Microsoft SQL Server
- Angular CLI

### Backend

```bash
npm install
# configure .env with DB credentials and SECRET_TOKEN
node server.js
```

### Frontend

```bash
cd Frontend
npm install
ng serve
```

## Author

**João Pedro da Costa Meira** — Student No. 23505
Supervised by: Patrícia Leite (IPCA) | Inês Caetano & Nuno Rocha (Sistrade)