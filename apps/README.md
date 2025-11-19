# BlogHub - Microservices Blog Platform

A microservices-based blog platform built with React (frontend) and Node.js/Express (backend services).

## Architecture

```
Frontend (React) → Post Service (Node.js) → MongoDB
                 → Comment Service (Node.js) → MongoDB
                 → User Service (Node.js) → MongoDB
```

## Services

- **Frontend**: React app with BlogHub UI (Port 3000)
- **Post Service**: Blog post management (Port 3001)
- **Comment Service**: Comment management (Port 3002)
- **User Service**: User authentication and management (Port 3003)
- **Notification Service**: Real-time notifications (Port 3004)

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Running Locally

#### Option 1: Quick Start (Recommended)
```bash
# Start all backend services at once
cd apps
./start-services.sh

# In a separate terminal, start the frontend
cd apps/frontend
npm install
npm run dev
```

#### Option 2: Manual Start

**1. Frontend**
```bash
cd apps/frontend
npm install
npm run dev
```
Frontend will be available at http://localhost:3000

**2. Backend Services (use start script or run individually)**

Using the script:
```bash
cd apps
./start-services.sh
```

Or manually:
```bash
# Post Service
cd apps/post-service
npm install
npm start

# Comment Service (in new terminal)
cd apps/comment-service
npm install
npm start

# User Service (in new terminal)
cd apps/user-service
npm install
npm start
```

**Services:**
- Post Service: http://localhost:3001
- Comment Service: http://localhost:3002
- User Service: http://localhost:3003

**To stop all services:**
```bash
cd apps
./stop-services.sh
```

### Running with Docker

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up
```

## API Endpoints

### Post Service
- `GET /api/posts` - List all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post

### Comment Service
- `GET /api/comments/post/:postId` - Get comments for post
- `POST /api/comments` - Create comment
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### User Service
- `POST /api/users/register` - Register user
- `POST /api/users/login` - Login user
- `GET /api/users/:id` - Get user
- `GET /api/users` - List users

### Notification Service
- `GET /api/notifications/user/:userId` - Get all notifications for user
- `GET /api/notifications/user/:userId/unread-count` - Get unread count
- `POST /api/notifications` - Create notification
- `PUT /api/notifications/:id/read` - Mark notification as read
- `PUT /api/notifications/user/:userId/read-all` - Mark all as read

## Next Steps

1. Add MongoDB for persistent storage
2. Add authentication middleware
3. Deploy to Kubernetes
4. Set up CI/CD pipeline
5. Add monitoring and logging

