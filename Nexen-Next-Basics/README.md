# Nexen-Next-Basics

A beginner-friendly Next.js project demonstrating authentication, protected routes, and a simple ToDo list application. This project uses TypeScript, MongoDB for data storage, and follows modern Next.js App Router patterns. It's designed to help beginners understand full-stack development with Next.js while providing value for experienced developers.

Whether you're new to web development or looking to refresh your Next.js skills, this README will guide you through the project structure, setup, features, and best practices. Navigation is easy with the table of contents below.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Features](#features)
- [Authentication](#authentication)
- [ToDo List Functionality](#todo-list-functionality)
- [Deployment](#deployment)
- [Tips and Tricks](#tips-and-tricks)
- [Notes](#notes)
- [Contributing](#contributing)
- [Resources](#resources)

## Introduction
This project is a basic full-stack application built with Next.js 14+ using the App Router. It includes:
- User authentication (login/register with MongoDB).
- Protected routes for authenticated users.
- A ToDo list where users can create and view tasks.
- Examples of different rendering strategies (SSR, SSG, ISR, CSR).

The project is structured to be modular and easy to extend. It uses Tailwind CSS for styling (via shadcn/ui components) and MongoDB for the database.

**For Beginners:** Next.js is a React framework that handles server-side rendering, routing, and API routes out of the box. This project shows how to integrate a database and authentication without external libraries like NextAuth (using custom API routes).

## Project Structure
The project follows the standard Next.js structure with the `src/` directory for organization. Here's a breakdown of folders and key files, explaining what each does. Comments are included in code files, but here we'll describe them.

### Root Level Files
These are configuration and setup files:
- [`package.json`](package.json): Defines dependencies (e.g., Next.js, React, MongoDB driver) and scripts (e.g., `npm run dev` to start the dev server).
- [`package-lock.json`](package-lock.json): Locks dependency versions for consistency.
- [`next.config.ts`](next.config.ts): Next.js configuration (e.g., for images, env vars). Currently basic.
- [`tsconfig.json`](tsconfig.json): TypeScript configuration for type checking.
- [`eslint.config.mjs`](eslint.config.mjs): Linting rules for code quality.
- [`postcss.config.mjs`](postcss.config.mjs): PostCSS config for Tailwind CSS.
- [`components.json`](components.json): Shadcn/ui component installer config.
- [`.gitignore`](.gitignore): Ignores files like `node_modules/` from Git.
- [`README.md`](README.md): This file! Documentation.

**Tip for Beginners:** Run `npm install` to install all dependencies from `package.json`.

### Public Folder (`public/`)
Static assets served directly:
- `next.svg`, `vercel.svg`, etc.: Images used in the app (e.g., logos).
- `favicon.ico`: Browser tab icon.

**What it does:** Files here are accessible at `/filename` (e.g., `/next.svg`).

### Source Code (`src/`)
All application code lives here.

#### `src/app/` - App Router (Pages and Layouts)
Next.js uses file-based routing. Folders with `page.tsx` create routes.
- `globals.css`: Global styles (Tailwind imports).
- `layout.tsx`: Root layout wrapping all pages (includes Navbar, Footer).
- `page.tsx`: Home page (landing or redirect).
- `not-found.tsx`: 404 page.

**Route Groups (Parentheses don't affect URL):**
- `(auth)/`: Authentication routes.
  - `login/page.tsx`: Login form page.
  - `register/page.tsx`: Registration form.
- `(example)/`: Demo rendering strategies.
  - `csr/page.tsx`: Client-Side Rendering example.
  - `ssr/page.tsx`: Server-Side Rendering.
  - `ssg/page.tsx`: Static Site Generation.
  - `isr/page.tsx`: Incremental Static Regeneration.
- `(protected)/`: Auth-protected routes.
  - `layout.tsx`: Middleware-protected layout (requires auth).
  - `todos/page.tsx`: List all todos.
  - `todos/create/page.tsx`: Create new todo form.

**What it does:** Each `page.tsx` is a React component rendered at that route (e.g., `/todos`).

#### `src/app/api/` - API Routes
Serverless API endpoints.
- `auth/login/route.ts`: POST handler for login (validates credentials, sets session).
- `auth/register/route.ts`: POST for user registration (saves to MongoDB).
- `auth/logout/route.ts`: POST to log out (clears session).
- `todos/route.ts`: GET/POST for todos (fetch/create).
- `todos/[id]/route.ts`: GET/DELETE/PUT for specific todo by ID.

**For Beginners:** API routes run on the server. Use `fetch('/api/todos')` from client code.

#### `src/components/` - Reusable UI Components
- `shared/`: App-specific.
  - `Navbar/Navbar.tsx`: Navigation bar (links to home, login, todos).
  - `Footer/Footer.tsx`: Page footer.
  - `ToDoListView/ToDoListView.tsx`: Displays todo list with CRUD operations.
- `ui/`: Shadcn/ui components (Button, Card, Input, etc.) - Pre-styled, customizable.
- `skeletons/TodoSkeleton.tsx`: Loading placeholder for todos.

**What it does:** Import and use like `<Button>Click me</Button>`.

#### `src/hooks/` 
- `useAuth.ts`: Custom hook for authentication state (e.g., `useAuth()` returns user/session).

#### `src/lib/`
- `utils.ts`: Helper functions (e.g., cn() for className merging).
- `mongoDB.ts`: MongoDB connection setup (singleton for efficiency).

#### `src/resources/`
- `dbConnect.md`: Documentation on database connection (existing file).

#### `src/service/`
- `getCurrentUser.ts`: Server-side function to fetch current user from session/cookies.

#### `src/types/`
- `todo.ts`: TypeScript interfaces (e.g., `interface Todo { id: string; text: string; }`).

#### Other Files
- `middleware.ts`: Runs before requests (e.g., protects `/todos` route, redirects unauth users).

**Navigation Tip:** Use VS Code's outline view or `Ctrl+Shift+O` to jump to sections in files.

## Getting Started
### Prerequisites
- Node.js 18+ (download from [nodejs.org](https://nodejs.org)).
- MongoDB Atlas account (free tier) for database.
- Git for version control.

### Installation
1. Clone the repo: `git clone <repo-url>`.
2. Navigate: `cd Nexen-Next-Basics`.
3. Install dependencies: `npm install`.
4. Set up MongoDB:
   - Create cluster on [MongoDB Atlas](https://www.mongodb.com/atlas).
   - Get connection string, add to `.env.local` (see Notes).
5. Run dev server: `npm run dev`.
6. Open [http://localhost:3000](http://localhost:3000).

**Troubleshooting:** If MongoDB errors, check `src/lib/mongoDB.ts` comments.

### Build and Start
- Build: `npm run build`.
- Start: `npm start`.

## Features
- **Authentication:** Secure login/register with session management.
- **Protected Routes:** Todos only visible to logged-in users.
- **ToDo CRUD:** Create, read, update, delete tasks.
- **Rendering Examples:** Learn SSR vs CSR.
- **Responsive UI:** Mobile-friendly with Tailwind.

## Authentication
1. Visit `/register` to create account (saves email/password hash to MongoDB).
2. `/login` to authenticate (sets cookie/session).
3. Protected pages redirect to login if unauth.
4. Logout clears session.

**Code Flow:** See `src/app/api/auth/` routes and `useAuth` hook. Passwords are hashed (add bcrypt if not already).

**For Beginners:** Sessions use cookies. Middleware checks `auth` cookie.

See detailed [AUTHENTICATION.md](src/resources/AUTHENTICATION.md) for step-by-step.

## ToDo List Functionality
1. Login, go to `/todos`.
2. View list (`ToDoListView` fetches from `/api/todos`).
3. Create: Form submits to `/api/todos`.
4. Edit/Delete: Via `[id]` API routes.

**Data Model:** Todos stored in MongoDB collection (see `src/types/todo.ts`).

See detailed [TODOS.md](src/resources/TODOS.md).

## Deployment
Easiest: Deploy to Vercel.
1. Push to GitHub.
2. Connect repo to [Vercel](https://vercel.com).
3. Add env vars (MONGODB_URI).
4. Deploy!

Other options: Railway, Render. Ensure MongoDB URI is set.

See detailed [DEPLOYMENT.md](src/resources/DEPLOYMENT.md).

## Tips and Tricks
- **Development:** Use `console.log` in API routes for debugging (logs to server terminal).
- **TypeScript:** Always define types in `src/types/` to avoid errors.
- **Styling:** Extend Tailwind in `globals.css`. Use shadcn/ui: `npx shadcn-ui@latest add <component>`.
- **Database:** Use MongoDB Compass to visualize data.
- **Performance:** For production, add caching in API routes (e.g., `cache: 'force-cache'` in fetch).
- **Testing:** Add unit tests with Jest: `npm install --save-dev jest`.
- **VS Code Extensions:** Install "Tailwind CSS IntelliSense", "ES7+ React/Redux/React-Native snippets".
- **Hot Reload:** Changes to pages auto-refresh browser.
- **Env Vars:** Never commit secrets; use `.env.local` (gitignored).

**Pro Tip:** For faster dev, run MongoDB locally with Docker: `docker run -d -p 27017:27017 mongo`.

## Notes
- **Security:** This is a basic auth example. In production, use HTTPS, rate limiting, and JWT instead of sessions if scaling.
- **Database:** Requires MongoDB URI in `.env.local` as `MONGODB_URI=mongodb+srv://...`.
- **Dependencies:** MongoDB installed via `npm install mongodb` and types `@types/mongodb`.
- **Limitations:** No email verification or password reset (add as extensions).
- **Learning Path:** Start with Next.js docs, then explore this project's API routes.
- **Existing Resource:** Check [dbConnect.md](src/resources/dbConnect.md) for DB setup details.
- **Updates:** This project uses Next.js 14+. Check compatibility for upgrades.

If you encounter issues, check console/logs or open an issue.

## Contributing
1. Fork the repo.
2. Create branch: `git checkout -b feature/new-feature`.
3. Commit: `git commit -m 'Add new feature'`.
4. Push: `git push origin feature/new-feature`.
5. Open PR.

Follow ESLint rules. Add tests for new features.

## Resources
- [Next.js Docs](https://nextjs.org/docs)
- [MongoDB Docs](https://www.mongodb.com/docs/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)

For more in-depth guides, see the .md files in `src/resources/`:
- [SETUP.md](src/resources/SETUP.md)
- [AUTHENTICATION.md](src/resources/AUTHENTICATION.md)
- [TODOS.md](src/resources/TODOS.md)
- [DEPLOYMENT.md](src/resources/DEPLOYMENT.md)
