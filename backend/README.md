# 🎬 Backend - Music Licensing Workflow API

This is the backend API for the **Music Licensing Workflow** system, built to help **ACME BROS PICTURES** manage the music licensing process for their movies. The system tracks tracks, songs, and their licensing status through a stateful workflow with real-time updates.

## 📋 Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Data Model](#data-model)
- [API Endpoints](#api-endpoints)
- [Real-Time Updates](#real-time-updates)
- [Setup Instructions](#setup-instructions)
- [Docker Setup](#docker-setup)
- [Database Migrations](#database-migrations)
- [Testing](#testing)
- [Environment Variables](#environment-variables)
- [Tech Decisions & Tradeoffs](#tech-decisions--tradeoffs)

## 🎯 Overview

This backend provides a RESTful API to manage:

- **Movies** - Film projects that contain multiple scenes
- **Scenes** - Individual scenes within a movie
- **Tracks** - Music tracks associated with scenes, specifying start and end times
- **Songs** - Song metadata (title, artist, genre)
- **Licenses** - Licensing status tracking with stateful workflow management

The system enables real-time visibility of licensing status updates through WebSocket connections, allowing multiple users to see changes immediately as they occur.

## 🛠 Tech Stack

### Core Technologies

- **Framework:** [NestJS](https://nestjs.com/) (v11.0.1) - Progressive Node.js framework
- **Language:** TypeScript (v5.7.3)
- **Database:** PostgreSQL (latest) - Primary relational database
- **ORM:** TypeORM (v0.3.27) - TypeScript ORM for database management
- **WebSockets:** Socket.IO via `@nestjs/platform-socket.io` - Real-time communication
- **Validation:** `class-validator` & `class-transformer` - DTO validation
- **Internationalization:** `nestjs-i18n` - Multi-language support for error messages

### Development Tools

- **Testing:** Jest - Unit and E2E testing
- **Linting:** ESLint with TypeScript support
- **Formatting:** Prettier
- **Containerization:** Docker with multi-stage builds

## 📁 Project Structure

```
backend/
├── src/
│   ├── modules/              # Feature modules
│   │   ├── movies/          # Movie management
│   │   ├── scenes/          # Scene management
│   │   ├── tracks/          # Track management (core feature)
│   │   ├── songs/           # Song catalog
│   │   ├── licenses/       # License status workflow
│   │   ├── websocket/       # Real-time updates gateway
│   │   └── health/          # Health check endpoint
│   ├── config/              # Configuration modules
│   │   ├── app.config.ts   # Application configuration
│   │   ├── typeorm.config.ts # Database configuration
│   │   └── i18n.config.ts  # Internationalization config
│   ├── db/
│   │   ├── migrations/      # Database migrations
│   │   ├── seeders/         # Database seeders
│   │   └── datasource.ts    # TypeORM datasource
│   ├── common/              # Shared utilities
│   │   ├── exceptions/      # Custom exceptions
│   │   └── filters/         # Exception filters
│   ├── utils/               # Utility functions
│   ├── i18n/                # Translation files
│   └── main.ts              # Application entry point
├── test/                     # E2E tests
├── scripts/                  # Utility scripts
├── Dockerfile               # Docker image definition
├── docker-compose.yml       # Docker Compose configuration
└── package.json             # Dependencies and scripts
```

## 🗄 Data Model

### Entity Relationships

```
Movie (1) ──< (N) Scene (1) ──< (N) Track (1) ──< (1) License
                                                      │
                                                      │
                                                      ▼
                                                  Status
                                                      │
                                                      │
                                                      ▼
                                            LicenseStatusHistory
```

### Entities

#### Movie

- `id` - Primary key
- `title` - Movie title
- `description` - Movie description
- `created_at`, `updated_at` - Timestamps
- `is_deleted` - Soft delete flag
- **Relations:** One-to-Many with `Scene`

#### Scene

- `id` - Primary key
- `movie_id` - Foreign key to Movie
- `title` - Scene title
- `description` - Scene description
- `created_at`, `updated_at` - Timestamps
- `is_deleted` - Soft delete flag
- **Relations:** Many-to-One with `Movie`, One-to-Many with `Track`

#### Track

- `id` - Primary key
- `scene_id` - Foreign key to Scene
- `song_id` - Foreign key to Song
- `start_time_seconds` - Track start time in scene
- `end_time_seconds` - Track end time in scene
- `created_at`, `updated_at` - Timestamps
- `is_deleted` - Soft delete flag
- **Relations:** Many-to-One with `Scene` and `Song`, One-to-One with `License`

#### Song

- `id` - Primary key
- `title` - Song title
- `artist` - Artist name
- `genre` - Song genre
- `created_at`, `updated_at` - Timestamps
- `is_deleted` - Soft delete flag
- **Relations:** One-to-Many with `Track`

#### License

- `id` - Primary key
- `track_id` - Foreign key to Track (unique)
- `status_id` - Foreign key to Status
- **Relations:** One-to-One with `Track`, Many-to-One with `Status`, One-to-Many with `LicenseStatusHistory`

#### Status

- `id` - Primary key
- `name` - Status name (e.g., "Pending", "In Negotiation", "Approved", "Rejected")
- **Relations:** One-to-Many with `License` and `LicenseStatusHistory`

#### LicenseStatusHistory

- Tracks the history of status changes for licenses
- **Relations:** Many-to-One with `License` and `Status`

## 🔌 API Endpoints

### Movies

- `POST /movies` - Create a new movie
- `GET /movies` - Get all movies (with pagination)
- `GET /movies/:id` - Get a movie by ID
- `PUT /movies/:id` - Update a movie
- `DELETE /movies/:id` - Soft delete a movie

### Scenes

- `POST /scenes` - Create a new scene
- `GET /scenes/movie/:movie_id` - Get all scenes for a movie (with pagination)
- `GET /scenes/:id` - Get a scene by ID
- `PUT /scenes/:id` - Update a scene
- `DELETE /scenes/:id` - Soft delete a scene

### Songs

- `POST /songs` - Create a new song
- `GET /songs` - Get all songs (with pagination)
- `GET /songs/:id` - Get a song by ID
- `PUT /songs/:id` - Update a song
- `DELETE /songs/:id` - Soft delete a song

### Tracks (Core Feature)

- `POST /tracks` - Create a track and associate a song
  - **Body:** `{ scene_id, song_id, start_time_seconds, end_time_seconds }`
  - **Note:** Automatically creates a License with default status
- `GET /tracks/:id` - Get a track by ID (includes license status)
- `GET /tracks/scene/:sceneId` - Get all tracks for a scene (with pagination)
- `GET /tracks/movie/:movieId` - Get all tracks for a movie (with pagination)
- `PUT /tracks/:id` - Update a track
- `PUT /tracks/:id/license/status` - **Update license status** (triggers WebSocket event)
  - **Body:** `{ status_id }`
- `DELETE /tracks/:id` - Soft delete a track

### Licenses

- `GET /licenses/:id` - Get a license by ID (includes status and history)

### Health Check

- `GET /health` - Health check endpoint

## 🔄 Real-Time Updates

The system implements **WebSocket** support using Socket.IO for real-time license status updates.

### WebSocket Gateway

- **Module:** `WebsocketModule`
- **Gateway:** `WebsocketGateway`
- **Event:** `licenseStatusUpdate`

### How It Works

1. When a license status is updated via `PUT /tracks/:id/license/status`, the system:
   - Updates the license status in the database
   - Records the status change in `LicenseStatusHistory`
   - Emits a `licenseStatusUpdate` event to all connected WebSocket clients

2. **Event Payload:**

   ```json
   {
     "licenseId": 1,
     "statusId": 2,
     "statusName": "In Negotiation",
     "trackId": 1,
     "timestamp": "2024-01-15T10:30:00Z"
   }
   ```

3. **Client Connection:**
   - Connect to the WebSocket server
   - Listen for `licenseStatusUpdate` events
   - Update UI in real-time when status changes occur

### Example Client Code

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('licenseStatusUpdate', (update) => {
  console.log('License status updated:', update);
  // Update your UI here
});
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (v22.20.0 or compatible)
- PostgreSQL (latest)
- npm or yarn

### Local Development Setup

1. **Clone the repository** (if not already done)

2. **Navigate to the backend directory:**

   ```bash
   cd backend
   ```

3. **Install dependencies:**

   ```bash
   npm install
   ```

4. **Set up environment variables:**
   Create a `.env` file in the `backend` directory:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=postgres
   DB_NAME=music_licensing
   PORT=3000
   FALLBACK_LANGUAGE=en
   ```

5. **Start PostgreSQL** (if not using Docker):

   ```bash
   # Make sure PostgreSQL is running locally
   ```

6. **Run database migrations:**

   ```bash
   npm run db:migrate:run
   ```

7. **Seed the database (optional):**

   ```bash
   npm run db:seed
   ```

8. **Start the development server:**
   ```bash
   npm run start:dev
   ```

The API will be available at `http://localhost:3000`

## 🐳 Docker Setup

### Using Docker Compose (Recommended)

The project includes a `docker-compose.yml` file that sets up both the backend and PostgreSQL database.

1. **Create a `.env` file** in the `backend` directory with the required variables (see [Environment Variables](#environment-variables))

2. **Build and start the services:**

   ```bash
   cd backend
   docker-compose up --build
   ```

3. **Run migrations** (first time only):

   ```bash
   docker-compose exec backend npm run db:migrate:run
   ```

4. **Seed the database** (optional):
   ```bash
   docker-compose exec backend npm run db:seed
   ```

The services will be available at:

- **API:** `http://localhost:3000`
- **PostgreSQL:** `localhost:5432`

### Docker Compose Services

- **backend:** NestJS application (port 3000)
- **postgres:** PostgreSQL database (port 5432)

The backend service waits for PostgreSQL to be healthy before starting.

## 📊 Database Migrations

### Running Migrations

```bash
# Run migrations
npm run db:migrate:run

# Or using the migration script
npm run db:migrate
```

### Creating New Migrations

Migrations are automatically run on application startup when `migrationsRun: true` is set in the TypeORM configuration.

## 🌱 Database Seeders

The project includes seeders to populate the database with initial data:

- **Status seeder** - Creates default license statuses
- **Movie seeder** - Creates sample movies
- **Scene seeder** - Creates sample scenes
- **Song seeder** - Creates sample songs
- **Track seeder** - Creates sample tracks with licenses
- **License seeder** - Creates sample licenses

### Running Seeders

```bash
npm run db:seed
```

## 🧪 Testing

### Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Test Structure

- **Unit tests:** Located alongside source files (`.spec.ts`)
- **E2E tests:** Located in the `test/` directory

## 🔧 Environment Variables

| Variable            | Description               | Default     |
| ------------------- | ------------------------- | ----------- |
| `DB_HOST`           | PostgreSQL host           | `localhost` |
| `DB_PORT`           | PostgreSQL port           | `5432`      |
| `DB_USER`           | Database user             | `postgres`  |
| `DB_PASSWORD`       | Database password         | -           |
| `DB_NAME`           | Database name             | -           |
| `PORT`              | Application port          | `3000`      |
| `FALLBACK_LANGUAGE` | Default language for i18n | `en`        |

## 💡 Tech Decisions & Tradeoffs

### Why NestJS?

- **Modular architecture:** Clean separation of concerns with modules
- **TypeScript-first:** Strong typing and better developer experience
- **Built-in features:** Dependency injection, decorators, and excellent tooling
- **Ecosystem:** Rich ecosystem with official integrations (TypeORM, WebSockets, etc.)

### Why REST over GraphQL?

- **Simplicity:** REST is straightforward for CRUD operations
- **Caching:** Better HTTP caching support
- **Familiarity:** Easier for frontend developers to consume
- **Tradeoff:** GraphQL would provide more flexibility for complex queries, but REST is sufficient for this use case

### Why PostgreSQL?

- **Relational data:** Perfect fit for structured data with relationships
- **ACID compliance:** Ensures data integrity for licensing workflows
- **Mature ecosystem:** Excellent tooling and community support
- **TypeORM integration:** Seamless integration with NestJS

### Why WebSockets (Socket.IO)?

- **Real-time updates:** Immediate notification of status changes
- **Bidirectional communication:** Can extend to support client-to-server events
- **Fallback support:** Socket.IO provides fallbacks for older browsers
- **Tradeoff:** Server-Sent Events (SSE) would be simpler for one-way updates, but WebSockets provide more flexibility for future features

### Why TypeORM?

- **TypeScript support:** Native TypeScript support with decorators
- **Active Record pattern:** Easy to use and understand
- **Migration support:** Built-in migration system
- **Relations:** Excellent support for entity relationships

### Soft Deletes

- **Implementation:** Using `is_deleted` flag instead of hard deletes
- **Reason:** Preserves data history for auditing and recovery
- **Tradeoff:** Requires filtering in queries, but provides better data integrity

### Internationalization (i18n)

- **Implementation:** Using `nestjs-i18n` for error messages
- **Reason:** Better user experience with localized error messages
- **Current support:** English and Spanish
