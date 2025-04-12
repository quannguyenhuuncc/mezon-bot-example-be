<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Mezon Bot Example Backend

A modern NestJS backend application built with TypeScript featuring authentication, user management, database integration, and advanced security features.

## Features

- **Authentication** - JWT-based authentication with refresh tokens
- **User Management** - Complete CRUD operations for user accounts
- **PostgreSQL Database** - TypeORM integration with Supabase
- **API Documentation** - Swagger/OpenAPI integration
- **Health Checks** - Endpoint for monitoring application health
- **Security** - Helmet integration, rate limiting, and CORS support
- **Logging** - Advanced logging with Pino
- **Validation** - Request validation using class-validator
- **Configuration** - Environment-based configuration with validation

## Prerequisites

- Node.js (v18 or newer)
- NPM or Yarn
- PostgreSQL (or PostgreSQL-compatible database)

## Environment Setup

1. Clone the repository
2. Create a `.env` file based on the provided `.env.example`

```bash
# Copy the example file
cp .env.example .env

# Edit the file with your database credentials and other settings
nano .env
```

## Database Configuration

This project is configured to use PostgreSQL with Supabase. You'll need to update your `.env` file with your database connection details:

```
DATABASE_HOST=your-host
DATABASE_PORT=your-port
DATABASE_USERNAME=your-username
DATABASE_PASSWORD=your-password
DATABASE_NAME=your-database
DATABASE_SYNCHRONIZE=true  # Set to false in production
DATABASE_LOGGING=true      # Set to false in production
DATABASE_SSL=true          # Depending on your connection requirements
```

## Installation

```bash
npm install
```

## Running the Application

```bash
# Development
npm run start

# Watch mode
npm run start:dev

# Production mode
npm run start:prod
```

## API Documentation

Once the application is running, you can access the Swagger documentation at:

```
http://localhost:3000/api
```

This provides interactive documentation for all available endpoints.

## Authentication

The application uses JWT for authentication:

1. Register a user with `POST /users`
2. Login with `POST /auth/login` to get access and refresh tokens
3. Use the access token in the Authorization header: `Bearer YOUR_TOKEN`
4. When the token expires, use `POST /auth/refresh` with your refresh token

## Available Endpoints

### Auth

- `POST /auth/login` - Authenticate a user
- `GET /auth/profile` - Get current user profile
- `POST /auth/logout` - Logout a user
- `POST /auth/refresh` - Refresh an expired access token

### Users

- `POST /users` - Create a new user
- `GET /users` - Get all users (authentication required)
- `GET /users/:id` - Get a specific user (authentication required)
- `PATCH /users/:id` - Update a user (authentication required)
- `DELETE /users/:id` - Delete a user (authentication required)

### Health

- `GET /health` - Check application and database health

## Development Tools

### Linting and Formatting

```bash
# Run ESLint
npm run lint

# Check ESLint without fixing
npm run lint:check

# Format code with Prettier
npm run prettier:write

# Check formatting without fixing
npm run prettier:check
```

### Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Deployment

For production deployment:

1. Set `NODE_ENV=production` in your environment
2. Set `DATABASE_SYNCHRONIZE=false` to prevent automatic schema changes
3. Set `DATABASE_LOGGING=false` to improve performance
4. Update the JWT secrets with strong random values
5. Consider using a process manager like PM2

## Project Structure

```
src/
├── common/           # Common utilities and base classes
├── config/           # Configuration modules
├── modules/          # Feature modules
│   ├── auth/         # Authentication and authorization
│   ├── health/       # Health checks
│   └── users/        # User management
└── main.ts           # Application entry point
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.
