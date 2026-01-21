# Project Management System

A Domain-Driven Design (DDD) Hexagonal Architecture implementation for a Project & Task Management application.

## Tech Stack
- **Backend**: Java 17, Spring Boot 3, Hibernate Envers, Flyway, JWT.
- **Frontend**: Angular, Angular Material.
- **Database**: PostgreSQL.
- **Ops**: Docker Compose, Prometheus, Grafana.

## Getting Started

### Prerequisites
- Docker & Docker Compose
- Java 17 (for local dev)
- Node.js & NPM (for local dev)

### Run with Docker
```bash
docker compose up --build
```
- Frontend: http://localhost:4200
- Backend API: http://localhost:8080
- Prometheus: http://localhost:9090
- Grafana: http://localhost:3000

## Architecture
Strict Hexagonal Architecture:
- `domain`: Pure Java entities and ports.
- `application`: Use Cases and DTOs.
- `infrastructure`: Adapters (Web, Persistence, Security).

## Security
- JWT Dual Token (Access 15m, Refresh).
- Refresh Token Rotation in DB.
- 401 Interceptor with Auto-Refresh on Frontend.

## API Documentation
Swagger UI available at `http://localhost:8080/swagger-ui.html` (when app is running).
