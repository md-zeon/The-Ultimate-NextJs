# Authentication Guide for Nexen-Next-Basics

This guide explains the authentication system in the Nexen-Next-Basics project. It's designed for beginners to understand how users log in, register, and stay authenticated, while also providing insights for experienced developers. We'll break down the code, flow, and best practices.

For project overview and setup, see the [README.md](../README.md) and [SETUP.md](SETUP.md).

## Table of Contents
- [Overview](#overview)
- [How Authentication Works](#how-authentication-works)
- [Key Components](#key-components)
- [Registration Process](#registration-process)
- [Login Process](#login-process)
- [Logout Process](#logout-process)
- [Protected Routes](#protected-routes)
- [Code Breakdown](#code-breakdown)
- [Testing Authentication](#testing-authentication)
- [Troubleshooting](#troubleshooting)
- [Tips for Beginners](#tips-for-beginners)
- [Security Notes](#security-notes)
- [Next Steps](#next-steps)

## Overview
Authentication (auth) verifies user identity. In this project:
- **Registration:** New users create accounts with email/password, stored in MongoDB.
- **Login:** Users enter credentials; if valid, a session cookie is set.
- **Protected Routes:** Pages like `/todos` require login; unauthenticated users redirect to `/login`.
- **Logout:** Clears the session.

We use custom server-side auth (no NextAuth.js) with cookies for sessions. Passwords are stored hashed (assuming bcrypt is used; check code). MongoDB stores users.

**For Beginners:** Think of auth like a key to a house. Registration makes the key, login uses it to enter, logout discards it.

## How Authentication Works
1. **User Data:** Stored in MongoDB `users` collection (email, hashed password, _id).
2. **Session:** After login, a cookie (e.g., `authToken`) holds user ID or session data, sent with every request.
3. **Middleware:** `src/middleware.ts` checks cookies on protected routes. If invalid/no cookie, redirect to login.
4. **API Routes:** Handle auth logic (validate, hash, etc.).
5. **Client-Side:** `useAuth` hook checks session to show/hide UI (e.g., navbar links).

**Flow Diagram (Text-Based):**
```
User visits /register --> Form submit --> API /api/auth/register --> Hash password --> Save to MongoDB --> Redirect to /login

User visits /login --> Form submit --> API /api/auth/login --> Validate email/password --> Set cookie --> Redirect to /todos

User visits /todos --> Middleware checks cookie --> Valid? --> Show page | Invalid? --> Redirect /login

User clicks logout --> API /api/auth/logout --> Clear cookie --> Redirect to /
```

## Key Components
- **Database:** MongoDB for users (see `src/lib/mongoDB.ts` for connection).
- **API Routes:** In `src/app/api/auth/` (register, login, logout).
- **Middleware:** `src/middleware.ts` protects `(protected)` route group.
- **Hook:** `src/hooks/useAuth.ts` for client-side auth state.
- **Pages:** `login/page.tsx`, `register/page.tsx` (forms).
- **Types:** `src/types/` (if user type defined).

## Registration Process
1. User navigates to `/register`.
2. Fills form (email, password) in `register/page.tsx`.
3. Form submits POST to `/api/auth/register`.
4. API:
   - Validates input (e.g., email format, password strength).
   - Checks if email exists.
   - Hashes password (using bcrypt or similar).
   - Inserts user into MongoDB.
   - Returns success/error.
5. On success, redirect to `/login`.

**Code Reference:** See comments in `src/app/api/auth/register/route.ts` for validation logic.

## Login Process
1. User goes to `/login`.
2. Submits form to `/api/auth/login`.
3. API:
   - Finds user by email.
   - Compares hashed password.
   - If match, creates session (e.g., JWT or simple token) and sets cookie.
   - Returns user data.
4. Client redirects to protected page.

**Note:** Cookies are HTTP-only for security (can't be accessed by JS).

## Logout Process
1. User clicks logout (e.g., in Navbar).
2. POST to `/api/auth/logout`.
3. API clears cookie (expires it).
4. Redirect to home.

## Protected Routes
- Route group `(protected)` in `src/app/`.
- `layout.tsx` in that group renders for `/todos`, etc.
- Middleware intercepts: If no valid cookie, redirect to `/login` with return URL.

**For Beginners:** Route groups organize code without affecting URLs (e.g., `/todos` not `/protected/todos`).

## Code Breakdown
### 1. API Route Example (`src/app/api/auth/login/route.ts`)
```typescript
// Comments explain each step
import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, verifyPassword } from '@/lib/auth'; // Assume helpers
import { connectToDatabase } from '@/lib/mongoDB';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();
    
    // Connect to DB
    const db = await connectToDatabase();
    const usersCollection = db.collection('users');
    
    // Find user
    const user = await usersCollection.findOne({ email });
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 401 });
    
    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    
    // Create session cookie
    const response = NextResponse.json({ message: 'Login successful', user: { id: user._id, email } });
    response.cookies.set('authToken', JSON.stringify({ userId: user._id }), { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    
    return response;
  } catch (error) {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
```
**What it does:** Handles login logic securely.

### 2. Middleware (`src/middleware.ts`)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from '@/service/getCurrentUser'; // Fetches from cookie

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Protect /todos routes
  if (pathname.startsWith('/todos')) {
    const user = getCurrentUser(request); // Checks cookie
    if (!user) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/todos/:path*', // Apply to /todos and subpaths
};
```
**Comments:** Checks auth before allowing access.

### 3. useAuth Hook (`src/hooks/useAuth.ts`)
```typescript
'use client';
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user from API or cookie (client-side check)
    fetch('/api/auth/me') // Assume /me route
      .then(res => res.json())
      .then(data => {
        setUser(data.user);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { user, loading };
}
```
**What it does:** Provides auth state in components.

Similar breakdowns for other files—check inline comments in code.

## Testing Authentication
1. Run dev server: `npm run dev`.
2. Go to `/register`, create user (e.g., test@example.com, password123).
3. `/login` with same credentials.
4. Visit `/todos`—should show list (empty at first).
5. Logout via navbar—redirect to home, can't access `/todos`.
6. Use browser dev tools (F12 > Application > Cookies) to see `authToken`.

**Tools:** Use Thunder Client extension in VS Code to test API POST requests.

## Troubleshooting
- **"Invalid credentials":** Check email/password, ensure hashing matches (add bcrypt if missing: `npm i bcrypt`).
- **Cookie not set:** Ensure `httpOnly: true` in code; check browser cookies.
- **Redirect loop:** Verify middleware matcher.
- **DB errors:** See [dbConnect.md](dbConnect.md); ensure MONGODB_URI correct.
- **CORS issues:** Not applicable for same-origin, but check if testing API directly.
- **Session lost:** Cookies expire? Set maxAge in cookie set.

Search error in code comments or Google "Next.js auth [error]".

## Tips for Beginners
- **Understand Sessions vs JWT:** Here, simple cookie; for scalability, use JWT (JSON Web Tokens).
- **Debug:** Add `console.log(user)` in middleware/API to see data in terminal.
- **Password Hashing:** Never store plain passwords! Use `bcrypt.compare()` for verification.
- **Forms:** Use React's `useState` for form state in pages.
- **Security First:** Always validate/sanitize inputs (e.g., with Zod library).
- **Extensions:** Add "REST Client" in VS Code for API testing.
- **Read Code:** Start with `login/page.tsx` form submit.

**Pro Tip:** For real apps, integrate NextAuth.js for OAuth (Google login).

## Security Notes
- **Basic Implementation:** This is educational. Production: Use HTTPS, rate limiting (express-rate-limit), email verification.
- **Hashing:** Ensure bcrypt is used; salt rounds 12+.
- **Cookies:** HTTP-only, secure flag in prod, sameSite: 'strict'.
- **No CSRF:** Add CSRF tokens for forms.
- **Limitations:** No 2FA or password reset (extend with email service like Nodemailer).

Review OWASP guidelines for web auth.

## Next Steps
- Explore [TODOS.md](TODOS.md) for CRUD operations.
- Customize: Add password confirmation in register form.
- Advanced: Implement JWT refresh tokens.
- Deploy: See [DEPLOYMENT.md](DEPLOYMENT.md)—set env vars for prod.

Refer to [Resources in README.md](../README.md#resources) for more learning.

If issues, check server logs or open a discussion!