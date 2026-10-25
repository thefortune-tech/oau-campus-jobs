# OAU Campus Jobs — Backend API

A RESTful backend for a campus job opportunity platform designed to connect Obafemi Awolowo University (OAU) students with employment opportunities within and around the campus community.

Built with **Node.js, TypeScript, Express, PostgreSQL, and Prisma ORM**, the API provides authentication, role-based access control, job management, applications, employer verification, saved jobs, and administrative moderation.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Database Setup](#database-setup)
- [Demo Data](#demo-data)
- [API Reference](#api-reference)
- [Authentication and Authorization](#authentication-and-authorization)
- [Error Handling](#error-handling)
- [Testing the API](#testing-the-api)
- [Project Structure](#project-structure)
- [Security Considerations](#security-considerations)
- [Contributing](#contributing)
- [License](#license)

## Overview

OAU Campus Jobs addresses the need for a centralized platform where students can discover campus-related work and employers can publish opportunities and manage applications.

The backend exposes a REST API consumed by a separate client application. It handles business logic, input validation, authentication, authorization, and persistent data storage.

The platform supports three primary user roles:

- **Students:** Discover jobs, submit applications, track applications, and save opportunities.
- **Employers:** Manage job listings and review applications, subject to employer verification.
- **Administrators:** Manage users, verify employers, moderate listings, and review reports.

## Features

### Authentication and user management
- User registration and login using email and password.
- Password hashing before storage.
- Token-based authentication using JSON Web Tokens (JWT).
- Authenticated user profile retrieval.
- Role-based authorization for protected resources.
- Student and employer account workflows.

### Job management
- Retrieve available job listings.
- View job details and employer information.
- Support paginated job listings.
- Create and manage job opportunities through authorized employer operations.
- Validate job-related request data.
- Restrict job publishing to verified employers.

### Applications and saved jobs
- Submit job applications.
- Retrieve a user's applications.
- Save job opportunities for later reference.
- Associate application and saved-job records with their relevant users and jobs.

### Administrative management
- Manage user records and roles through authorized operations.
- Verify employer accounts.
- Moderate job listings.
- Review submitted job reports.

### Database and development
- PostgreSQL for relational data persistence.
- Prisma ORM for database access and schema management.
- Versioned database migrations.
- Seed data for development and demonstrations.
- TypeScript for type safety.
- Zod for request validation.

## Technology Stack

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| TypeScript | Typed application development |
| Express 5 | HTTP server and REST API routing |
| PostgreSQL | Relational database |
| Prisma ORM | Database queries, schema, and migrations |
| `@prisma/adapter-pg` | PostgreSQL driver adapter |
| Zod | Runtime request validation |
| bcryptjs | Password hashing |
| JSON Web Token | Authentication tokens |
| Helmet | HTTP security headers |
| CORS | Cross-origin request configuration |
| Express rate limiting | Request rate limiting |
| tsx | TypeScript development execution |

## Architecture

The backend uses a modular structure that separates routing, HTTP handling, business logic, validation, and database access.

A typical request follows this flow:

```text
Client Application
       |
       v
Express Router
       |
       v
Authentication Middleware
       |
       v
Controller
       |
       v
Validation / Service Layer
       |
       v
Prisma ORM + PostgreSQL
       |
       v
HTTP Response
```

The responsibilities are separated as follows:

- **Routes:** Define API paths and connect requests to their handlers.
- **Controllers:** Handle HTTP requests and construct responses.
- **Services:** Implement application rules and coordinate database operations.
- **Validation:** Check incoming request data.
- **Middleware:** Handle cross-cutting concerns such as authentication and errors.
- **Prisma:** Provides typed database access.

This structure makes individual modules easier to maintain, test, and extend.

## Prerequisites

Install the following before running the project:

- Node.js 24 or a compatible version.
- npm.
- PostgreSQL.
- Git.
- A REST client such as Postman, Insomnia, or the VS Code REST Client extension.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/thefortune-tech/oau-campus-jobs.git
cd oau-campus-jobs/backend
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local `.env` file using the provided example:

```powershell
Copy-Item .env.example .env
```

Open `.env` and configure the required values for your local environment.

### 4. Create the PostgreSQL database

Create a PostgreSQL database for the project. For example:

```sql
CREATE DATABASE oau_campus_jobs;
```

Update the database connection configuration in `.env` to point to that database.

### 5. Apply database migrations

```bash
npx prisma migrate deploy
```

This applies the migrations included in the repository. For local schema development, use the appropriate Prisma development migration workflow instead.

### 6. Generate the Prisma client

The project build script generates the Prisma client automatically. You can also run:

```bash
npx prisma generate
```

### 7. Start the development server

```bash
npm run dev
```

The API runs on the configured port. In the current local setup, the base URL is:

`http://localhost:4000`

Verify that the server is running:

```http
GET /health
```

Expected response:

```json
{
  "status": "ok",
  "message": "OAU Campus Jobs API is running"
}
```

### 8. Build the project

```bash
npm run build
```

### 9. Run the production build

After a successful build and database configuration:

```bash
npm start
```

The production command starts the compiled server from `dist/server.js`.

## Environment Configuration

Environment variables belong in the local `.env` file and must not be committed to version control.

Use `.env.example` as the reference for the required variables. Configure the database URL, authentication secrets, server settings, and any other variables required by the current application.

**Never publish real passwords, database credentials, JWT secrets, or production environment values.**

## Database Setup

The database schema is maintained in:

`prisma/schema.prisma`

Versioned migrations are stored in:

`prisma/migrations/`

Prisma manages database access and provides typed queries to the service layer.

The project includes migration history for the initial schema and subsequent profile, administrative, and job-report functionality.

For an existing database, apply the committed migrations rather than manually recreating the tables.

## Demo Data

The repository includes a seed script at:

`prisma/seed.ts`

Run it using:

```bash
npm run db:seed
```

The script creates demonstration records for:

- An administrator account.
- Student accounts and profiles.
- Employer accounts and profiles.
- Job listings.
- Job applications.
- Saved jobs.
- Job reports.

The demo dataset allows developers to exercise API workflows without manually creating every record.

### Demo accounts

The development seed currently uses the following email addresses:

| Role | Email |
|---|---|
| Administrator | `admin@oaucampusjobs.test` |
| Employer | `employer1@oaucampusjobs.test` |
| Student | `student1@oaucampusjobs.test` |

The seed script defines the demo password. Consult `prisma/seed.ts` in your local development environment for its current value.

**These are development accounts, not production credentials.** Use only a development or demonstration database when running the seed script. The script upserts matching demo records and can update those records when rerun.

## API Reference

The API is organized into modules for authentication, users, jobs, applications, and administration.

The following table summarizes the main routes verified or established during development. Consult the corresponding router files for the complete request schemas and any additional endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/health` | Check API health |
| `POST` | `/api/auth/register` | Register an account |
| `POST` | `/api/auth/login` | Authenticate a user |
| `GET` | `/api/users/me` | Retrieve the authenticated user's profile |
| `GET` | `/api/jobs` | Retrieve paginated job listings |
| `POST` | `/api/admin/employers/:profileId/verification` | Verify an employer, if configured by the router |

Application, saved-job, job-management, and other administrative routes are defined in their respective router modules.

### Example: Register an account

The exact request fields depend on the selected account type and the validation schema.

```http
POST /api/auth/register
Content-Type: application/json
```

Send the registration fields expected by the current `auth-validation.ts` implementation.

### Example: Log in

```http
POST /api/auth/login
Content-Type: application/json
```

Submit the registered email address and password. On successful authentication, the API returns an authentication token and the relevant user information.

### Example: Retrieve the current user

```http
GET /api/users/me
Authorization: Bearer YOUR_JWT_TOKEN
```

The authentication middleware validates the token before allowing access to the protected endpoint.

### Example: Retrieve jobs

```http
GET /api/jobs
```

The job listing endpoint returns job records and pagination metadata. Pagination defaults and supported query parameters are determined by the current job validation and service implementation.

## Authentication and Authorization

The backend uses JWT-based authentication.

After a successful login:

1. The client receives the authentication token.
2. The client includes the token in the `Authorization` header for protected requests.
3. Authentication middleware validates the token.
4. Role-based authorization restricts access to operations that require specific permissions.

Example:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Role security

A user must not gain administrator access simply by submitting `ADMIN` during public registration. Administrative privileges must be assigned through a trusted, authorized process.

Employer verification is enforced separately from authentication. A registered employer is not automatically authorized to publish jobs until the verification requirement is satisfied.

The frontend may adapt its interface based on the authenticated role, but **the backend remains responsible for enforcing permissions**.

## Error Handling

The project includes centralized error-handling middleware.

API clients should handle appropriate HTTP status codes, including:

| Status | Meaning |
|---|---|
| `200 OK` | Request completed successfully |
| `201 Created` | Resource created successfully |
| `400 Bad Request` | Invalid request or validation failure |
| `401 Unauthorized` | Authentication required or invalid |
| `403 Forbidden` | Authenticated user lacks permission |
| `404 Not Found` | Requested resource does not exist |
| `500 Internal Server Error` | Unexpected server-side failure |

Actual status codes depend on the specific endpoint and error condition.

## Testing the API

You can test the API using Postman, Insomnia, or another HTTP client.

Recommended workflow:

1. Check the health endpoint.
2. Register a student account.
3. Log in and obtain a token.
4. Retrieve the authenticated user's profile.
5. Retrieve the job listings.
6. Register an employer and test the verification restriction.
7. Use an authorized administrator to verify the employer.
8. Test job creation and application workflows.
9. Confirm that unauthorized users cannot access protected operations.

Run the production build to check TypeScript compilation and Prisma client generation:

```bash
npm run build
```

## Project Structure

```text
backend/
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
├── src/
│   ├── config/
│   │   └── env.ts
│   ├── database/
│   │   └── prisma.ts
│   ├── jobs/
│   │   ├── job-controller.ts
│   │   ├── job-report-service.ts
│   │   ├── job-report-validation.ts
│   │   ├── job-router.ts
│   │   ├── job-service.ts
│   │   └── job-validation.ts
│   ├── middleware/
│   │   ├── authenticate.ts
│   │   └── error-handler.ts
│   ├── modules/
│   │   ├── admin/
│   │   ├── applications/
│   │   ├── auth/
│   │   └── users/
│   └── server.ts
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── prisma.config.ts
└── tsconfig.json
```

## Security Considerations

- Keep `.env` and production secrets out of version control.
- Use strong, unique JWT secrets in production.
- Never store plaintext passwords.
- Restrict administrator privileges to authorized accounts.
- Enforce employer verification on the backend.
- Validate and sanitize incoming data.
- Configure CORS for the intended client origins.
- Use HTTPS in production.
- Protect production databases and restrict database access.
- Replace development credentials before a public deployment.
- Review logs and error responses to ensure sensitive information is not exposed.

## Contributing

Contributions and suggestions are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Make your changes.
4. Run the project build and test the affected API workflows.
5. Submit a pull request describing the changes.

Keep changes focused and avoid committing environment files, generated build output, or credentials.

## License

A license has not yet been specified. Until a license is added to the repository, do not assume that the code is available for unrestricted reuse.

---

**Project:** OAU Campus Jobs — Backend API  
**Repository:** [thefortune-tech/oau-campus-jobs](https://github.com/thefortune-tech/oau-campus-jobs)  
**Maintainer:** Fortune Dev
