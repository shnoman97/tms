# Token Management Service - Encore.ts

The APIs built with Encore.ts and PostgreSQL.

## Stack

- **Framework**: Encore.ts
- **Language**: TypeScript (strict mode)
- **Database**: PostgreSQL with SQLDatabase ussing docker
- **Testing**: Vitest - Encore's recommended testing framework

## Features

- ✅ Create access tokens with scopes and expiry
- ✅ List non-expired tokens for a user
- ✅ Full TypeScript type safety
- ✅ Built-in input validation
- ✅ Database migrations with Encore
- ✅ Automatic API documentation
- ✅ Unit tests

## Getting Started

### Install Encore CLI

```bash
# macOS
brew install encoredev/tap/encore

# Linux
curl -L https://encore.dev/install.sh | bash

# Windows
iwr https://encore.dev/install.ps1 | iex
```

### Run the Application

```bash
# Clone the repository
git clone 
cd token-management-service

# Install dependencies
npm install

# Run the application (Encore handles database setup automatically)
encore run

# The application will be available at http://localhost:4000
# API Explorer: http://localhost:9400
```

## Running Tests

```bash
# Run all tests
encore test
