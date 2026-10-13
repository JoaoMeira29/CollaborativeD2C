# Collaborative Direct2Consumer — Authentication Module

A centralized authentication module for the Collaborative Direct2Consumer (D2C) platform: an Express REST API that issues and validates JWTs, and an Angular portal that consumes it.

Internship project developed at **Sistrade - Software Consulting, S.A.** as part of the Degree in Computer Systems Engineering at **IPCA - Polytechnic University of Cávado and Ave**. The full write-up is in [Report.pdf](Report.pdf).

> **Status:** academic prototype, published with Sistrade's agreement. It is not production-ready — see [Known limitations](#known-limitations).

## Overview

The D2C platform is part of a larger R&D initiative for the Textile and Clothing Industry. It brings together several external modules and services (e.g. virtual fitting room, e-commerce store, weather service), each of which would otherwise ask the user to log in again.

This module removes that repetition: the user authenticates once in the main system and receives a signed token that every integrated service can verify.

## How it works

1. The client posts credentials to `/authLogin`.
2. The API checks the user in SQL Server and confirms the account is `Active`.
3. The API signs a JWT (valid for 1 hour) with `SECRET_TOKEN`, returns it in the response body and sets it as a `token` cookie.
4. On protected routes, middleware verifies the token and checks the user's role (`Admin` or `Normal`) before the request reaches the controller.
5. In the Angular app, a `CanActivate` guard blocks protected pages when the token is missing or expired.

## Tech stack

| Layer | Technology |
|---|---|
| Backend API | Node.js, Express 4 |
| Frontend | Angular 21, TypeScript |
| Database | Microsoft SQL Server (Sequelize, `tedious`) |
| Authentication | JSON Web Tokens (`jsonwebtoken`) + HTTP cookie |
| Tests | Jest + Supertest (API), Karma + Jasmine (frontend) |

## Project structure

```
├── API/
│   ├── controllers/       # Auth (login, register) and user request handlers
│   ├── middleware/        # JWT verification and role authorization
│   ├── models/            # Sequelize models
│   ├── routes/            # Route definitions
│   ├── services/          # User queries
│   ├── specsOpenAPI/      # OpenAPI specification
│   ├── tests/             # Jest tests
│   ├── utils/             # Role and status enums
│   ├── app.js             # Express app
│   ├── config.js          # Environment configuration
│   ├── sequelize.js       # Database connection
│   └── server.js          # Entry point
├── Frontend/
│   └── src/app/
│       ├── _shared/       # Header, footer, 404 page, auth and user services
│       └── features/      # Login, register, home, profile, edit profile
└── Report.pdf             # Internship report
```

## API

Base URL: `/collaborativeD2C/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/authLogin` | Public | Authenticate a user and issue a token |
| POST | `/authRegister` | Public | Register a user and issue a token |
| GET | `/listUsers` | Admin | List all users |
| GET | `/listUser/:ID` | Normal, Admin | Get a user by ID |
| GET | `/listUserByEmail` | Admin | Get a user by email |
| POST | `/createUser` | Admin | Create a user |
| PUT | `/updateUser/:ID` | Normal, Admin | Update a user |
| PATCH | `/updateUserStatus/:ID` | Normal, Admin | Activate or deactivate a user |
| DELETE | `/deleteUser/:ID` | Normal, Admin | Delete a user |

Protected endpoints expect the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

The user endpoints are also described in [API/specsOpenAPI/userOpenAPI.yaml](API/specsOpenAPI/userOpenAPI.yaml).

## Getting started

### Prerequisites

- Node.js and npm
- Microsoft SQL Server with a database containing a `User` table (columns: `ID`, `name`, `surname`, `email`, `password`, `status`, `role`)
- Angular CLI (`npm install -g @angular/cli`)

### Backend

```bash
cd API
npm install
```

Create `API/.env`:

```env
PORT=3000
HOST=localhost
HOST_URL=http://localhost:3000
SQL_SERVER=localhost
SQL_DATABASE=your_database
SQL_USER=your_user
SQL_PASSWORD=your_password
ENCRYPT=false
SECRET_TOKEN=a-long-random-string
```

`PORT` and `HOST` are required. Keep `PORT=3000`, since the frontend calls the API at `http://localhost:3000`.

```bash
npm start
```

### Frontend

```bash
cd Frontend
npm install
ng serve
```

The app is served at `http://localhost:4200`.

### Tests

```bash
cd API
npm test
```

The API tests mock the user service, so they run without a database.

## Known limitations

This is a learning project and some parts are unfinished:

- Passwords are stored and compared in plain text; they should be hashed (e.g. bcrypt).
- The `token` cookie is set without `httpOnly`, `secure` or `sameSite`.
- CORS is open to every origin.
- The API is covered by unit tests with a mocked database only; it has not been tested end to end against SQL Server.
- Any signed-in user can update or delete any other user: the routes check the role, not ownership.
- The API URL is hardcoded in the Angular auth service.

## Author

**João Pedro da Costa Meira** — Student No. 23505

Supervised by Patrícia Leite (IPCA), Inês Caetano and Nuno Rocha (Sistrade).

## License

© 2026 João Meira. All rights reserved.

This project is for the exclusive use of its author(s) and/or the academic institution. Copying, distributing, modifying or using this code, in whole or in part, for commercial or academic purposes is not permitted without the author's prior written authorization.
