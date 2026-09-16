# DIGITwinTHON - Centralized Technical Club Management System

## Overview

DIGITwinTHON is a comprehensive platform for managing technical clubs in educational institutions. It provides a centralized system for handling memberships, events, certificates, learning resources, projects, and more.

## Features

### Core Features
- **User Management**: Registration, login, profile management with role-based access control
- **Club Management**: Create, manage, and organize technical clubs
- **Membership System**: Join clubs, digital membership cards with QR codes
- **Event Management**: Create, register, track attendance, collect feedback
- **Certificate Generation**: Automatic certificate generation with verification
- **Project Showcase**: Submit, review, and showcase technical projects
- **Learning Management**: Resources, roadmaps, progress tracking
- **Announcements**: Club and system announcements
- **Notifications**: Real-time notifications for various activities
- **Analytics**: Comprehensive dashboards and reports
- **Audit Logs**: Track important administrative actions

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based authentication
- **Additional Libraries**:
  - `bcryptjs` for password hashing
  - `zod` for validation
  - `react-hook-form` for form handling
  - `recharts` for analytics
  - `qrcode.react` for QR codes
  - `jspdf` for certificate generation

## Project Structure

```
.
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/              # Authentication endpoints
│   │   ├── clubs/             # Club management
│   │   ├── events/            # Event management
│   │   ├── users/             # User management
│   │   └── ...
│   ├── auth/                  # Authentication pages
│   ├── dashboard/             # Dashboard pages
│   ├── layout.tsx             # Root layout
│   ├── globals.css            # Global styles
│   └── page.tsx               # Home page
├── components/                # Reusable components
│   ├── theme-provider.tsx     # Theme management
│   └── ...
├── lib/
│   ├── prisma.ts              # Prisma client
│   ├── auth.ts                # JWT utilities
│   ├── password.ts            # Password hashing
│   ├── constants.ts           # Constants and roles
│   ├── api-response.ts        # API response formatting
│   └── middleware-auth.ts     # Authentication middleware
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── migrations/            # Database migrations
├── public/                    # Static assets
└── scripts/
    └── seed.ts                # Database seeding
```

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL 12+
- Git

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/praveen200502/digitwinthon.git
   cd digitwinthon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/digitwinthon"
   JWT_SECRET="your-secret-key-here"
   JWT_EXPIRE="7d"
   NEXT_PUBLIC_API_URL="http://localhost:3000/api"
   NODE_ENV="development"
   ```

4. **Set up the database**
   ```bash
   npm run db:migrate
   npm run db:generate
   npm run db:seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint

# Format code
npm run format

# Database migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database with demo data
npm run db:seed

# Open Prisma Studio
npm run db:studio

# Type checking
npm run type-check
```

## User Roles

1. **STUDENT**: Basic user who can browse clubs, register for events, view resources
2. **CLUB_MEMBER**: Club member with additional club-specific access
3. **CLUB_COORDINATOR**: Manages club events, members, and announcements
4. **FACULTY_COORDINATOR**: Approves club actions and reviews projects
5. **CLUB_ADMIN**: Full club management including certificates and reports
6. **DEPARTMENT_COORDINATOR**: Monitors department clubs and generates reports
7. **SUPER_ADMIN**: Full system control

## Database Schema

The database includes the following main entities:
- **User**: User accounts and profiles
- **Role**: User roles and permissions
- **Department**: Academic departments
- **Club**: Technical clubs
- **ClubMembership**: Club membership records
- **Event**: Club events
- **EventRegistration**: Event registrations
- **Attendance**: Event attendance records
- **Certificate**: Generated certificates
- **Project**: Student/team projects
- **LearningResource**: Educational resources
- **Notification**: User notifications
- **AuditLog**: Administrative action logs

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user

### Clubs
- `GET /api/clubs` - Get all clubs
- `GET /api/clubs/:id` - Get club details
- `POST /api/clubs` - Create club
- `PUT /api/clubs/:id` - Update club

### Events
- `GET /api/events` - Get events
- `POST /api/events` - Create event
- `POST /api/events/:id/register` - Register for event
- `GET /api/events/:id/attendance` - Get event attendance

### Certificates
- `GET /api/certificates/:id` - Get certificate
- `GET /api/certificates/:id/verify` - Verify certificate

## Demo Credentials

After running the seed script, use these credentials:

```
Student Account:
Email: student@example.com
Password: password123

Admin Account:
Email: admin@example.com
Password: password123
```

## Security

- Passwords are hashed using bcryptjs
- JWT tokens for authentication
- Input validation with Zod
- Protected API routes with authentication middleware
- CSRF protection ready
- XSS protection with React
- Secure environment variable management

## License

This project is created for the DIGITwinTHON hackathon.

## Support

For issues or questions, please create an issue on GitHub.
