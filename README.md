# Niveshventures Platform

A full-stack crypto platform starter template with a split frontend architecture for users and administrators.

## 🚀 Architecture Overview

This monorepo contains three main applications:

- **`/backend`**: The core API built with **NestJS**, using **Prisma** as the ORM, with JWT authentication.
- **`/frontend`**: The user-facing web application built with **React**, **Vite**, **Tailwind CSS**, and **Framer Motion**.
- **`/admin-frontend`**: The administrative dashboard built with **React**, **Vite**, and **Tailwind CSS**.

## 🛠 Tech Stack

### Backend
- [NestJS](https://nestjs.com/) (Framework)
- [Prisma](https://www.prisma.io/) (ORM)
- [PostgreSQL](https://www.postgresql.org/) (Database via Docker)
- Passport & JWT (Authentication)

### Frontend & Admin
- [React](https://reactjs.org/) (UI Library)
- [Vite](https://vitejs.dev/) (Build Tool)
- [Tailwind CSS](https://tailwindcss.com/) (Styling)
- [Framer Motion](https://www.framer.com/motion/) (Animations)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Docker](https://www.docker.com/) & Docker Compose (for the database)
- npm or yarn

## 🚦 Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/alokydv9045/niveshventures.git
   cd niveshventures
   ```

2. **Install all dependencies:**
   From the root directory, run:
   ```bash
   npm run install:all
   ```

3. **Start the Database:**
   ```bash
   npm run start:db
   ```
   *Note: This will spin up the database container defined in `docker-compose.yml`.*

4. **Environment Variables:**
   Make sure to configure your `.env` files in the `backend`, `frontend`, and `admin-frontend` directories based on any provided `.env.example` templates.

5. **Run the Development Servers:**
   You can start the different components using the root scripts:
   - **Backend:** `npm run dev:backend` (Runs on port 3000 by default)
   - **User Frontend:** `npm run dev:frontend`
   - **Admin Frontend:** `npm run dev:admin`

## 📜 Available Root Scripts

- `npm run start:db` - Starts the database via Docker Compose.
- `npm run stop:db` - Stops the database container.
- `npm run dev:backend` - Starts the NestJS backend in watch mode.
- `npm run dev:frontend` - Starts the Vite development server for the user frontend.
- `npm run dev:admin` - Starts the Vite development server for the admin frontend.
- `npm run install:all` - Installs dependencies for all three projects sequentially.

## 📂 Folder Structure

```
niveshventures/
├── admin-frontend/     # React + Vite admin dashboard
├── backend/            # NestJS API server
├── frontend/           # React + Vite user-facing app
├── docker-compose.yml  # Database services
├── render.yaml         # Deployment configuration
├── package.json        # Root scripts
└── README.md
```

## 📝 License
This project is proprietary and unlicensed.
