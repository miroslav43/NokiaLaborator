# Advanced Full-Stack Todo App

A feature-rich Todo application with React frontend, FastAPI backend, and PostgreSQL database.

## Features

### Backend (Python FastAPI)
- ✅ Full CRUD operations for todos
- 📊 Statistics endpoint (total, completed, pending)
- 🏷️ Categories with colors
- 🎯 Priority levels (low, medium, high)
- 📝 Todo descriptions
- 🔍 Advanced filtering (by status, priority, category)
- 🗄️ PostgreSQL with SQLAlchemy ORM
- 🔄 Auto-retry database connection on startup

### Frontend (React + Vite)
- 📝 Rich todo creation form
- 📊 Real-time statistics dashboard
- 🎨 Color-coded priorities and categories
- 🔍 Multi-filter system
- 💅 Modern, responsive UI
- ⚡ Fast and lightweight

### Database
- 🐘 PostgreSQL 15 Alpine
- 📦 Volume persistence
- 🌱 Automatic seed data initialization

## Structure

- `frontend/`: React app with Vite (Dockerized with Nginx)
- `backend/`: FastAPI app with SQLAlchemy (Dockerized)
- `db/`: PostgreSQL database with custom Dockerfile and init scripts

## Prerequisites

- Docker
- Docker Compose

## Running the App


Build and start the containers:

```bash
docker compose up --build
```


* [ ] Access the application:

- [ ] Frontend: http://localhost:3000
- [ ] Backend API Docs: http://localhost:8000/docs


## Environment Variables

The application works out of the box with default values. You can override them in `docker-compose.yml` or a `.env` file:

- `POSTGRES_USER`: Database user (default: postgres)
- `POSTGRES_PASSWORD`: Database password (default: postgres)
- `POSTGRES_DB`: Database name (default: todo_db)

## Accessing Containers

To enter a running container:

```bash
# View running containers
docker ps

# Enter backend container
docker exec -it docker-backend-1 /bin/bash

# Enter frontend container
docker exec -it docker-frontend-1 /bin/sh

# Enter database container
docker exec -it docker-db-1 /bin/sh

# Or connect directly to PostgreSQL
docker exec -it docker-db-1 psql -U postgres -d todo_db
```

## API Endpoints

- `GET /todos` - List all todos (with optional filters: completed, priority, category_id)
- `POST /todos` - Create a new todo
- `PUT /todos/{id}` - Update a todo
- `DELETE /todos/{id}` - Delete a todo
- `GET /categories` - List all categories
- `GET /todos/stats` - Get statistics
- `GET /docs` - Interactive API documentation (Swagger UI)

---

## 🚢 Kubernetes Deployment

This project also includes Kubernetes configurations for production-grade deployment.

### Quick Start with Kubernetes

1. **Install Prerequisites (Mac)**:
   ```bash
   # Option 1: Docker Desktop (EASIEST)
   # Download from https://www.docker.com/products/docker-desktop
   # Then enable Kubernetes in Settings → Kubernetes
   
   # Option 2: Minikube
   brew install minikube kubectl
   minikube start
   
   # Option 3: Kind
   brew install kind kubectl
   kind create cluster --name todo-app
   ```

2. **Deploy to Kubernetes**:
   ```bash
   # Automated deployment
   ./k8s/deploy.sh
   
   # OR manual deployment
   kubectl apply -f k8s/
   ```

3. **Access the Application**:
   ```bash
   # Port forward to access locally
   kubectl port-forward -n todo-app svc/frontend-service 3000:80
   
   # Open in browser: http://localhost:3000
   ```

### Kubernetes Features

- 🔄 **Auto-scaling**: 2 replicas for frontend and backend
- 💾 **Persistent Storage**: PostgreSQL data persisted in PersistentVolume
- 🔍 **Health Checks**: Liveness and readiness probes
- 🔐 **Configuration Management**: ConfigMaps for environment variables
- 📊 **Self-healing**: Automatic pod restart on failures

For detailed Kubernetes instructions, see [k8s/README.md](k8s/README.md)

---

## 📦 Deployment Options Comparison

| Feature | Docker Compose | Kubernetes |
|---------|----------------|------------|
| **Use Case** | Development | Production |
| **Complexity** | Simple | Advanced |
| **Scaling** | Manual | Automatic |
| **High Availability** | ❌ | ✅ |
| **Load Balancing** | Limited | Built-in |
| **Self-healing** | ❌ | ✅ |
| **Rolling Updates** | ❌ | ✅ |
