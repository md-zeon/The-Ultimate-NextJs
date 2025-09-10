# ToDo List Functionality Guide for Nexen-Next-Basics

This guide details the ToDo list feature in the Nexen-Next-Basics project. It's beginner-friendly, explaining how the CRUD (Create, Read, Update, Delete) operations work, the code behind it, and tips for understanding or extending it. For experienced developers, it includes code breakdowns and optimization ideas.

Refer to the [README.md](../README.md) for project overview and [AUTHENTICATION.md](AUTHENTICATION.md) for login requirements (ToDos require auth).

## Table of Contents
- [Overview](#overview)
- [How the ToDo System Works](#how-the-todo-system-works)
- [Key Components](#key-components)
- [Creating a ToDo](#creating-a-todo)
- [Viewing ToDos](#viewing-todos)
- [Updating a ToDo](#updating-a-todo)
- [Deleting a ToDo](#deleting-a-todo)
- [Code Breakdown](#code-breakdown)
- [Testing the ToDo Feature](#testing-the-todo-feature)
- [Troubleshooting](#troubleshooting)
- [Tips for Beginners](#tips-for-beginners)
- [Advanced Notes](#advanced-notes)
- [Next Steps](#next-steps)

## Overview
The ToDo list allows authenticated users to manage personal tasks. Features:
- **Create:** Add new tasks via a form.
- **Read:** Display list of tasks fetched from MongoDB.
- **Update:** Edit task text (via API).
- **Delete:** Remove tasks.
- **User-Specific:** ToDos are tied to the logged-in user (stored with user ID).

Data is stored in a MongoDB `todos` collection. The UI uses shadcn/ui components for a clean, responsive design. Rendering is server-side for security (API handles data).

**For Beginners:** CRUD is like a notebook app: add notes, view them, edit, delete. Here, it's web-based with a database instead of local storage.

## How the ToDo System Works
1. **Auth Check:** User must be logged in (middleware protects `/todos`).
2. **Data Flow:** Client (browser) calls API routes to interact with MongoDB.
3. **Storage:** Each ToDo has fields like `text`, `completed` (bool), `userId`, `_id`.
4. **UI:** `ToDoListView` component renders the list, handles actions.
5. **Fetching:** On page load, GET `/api/todos` fetches user's ToDos.

**Flow Diagram (Text-Based):**
```
Logged-in User --> /todos page --> Fetch GET /api/todos (filter by userId) --> Display in ToDoListView

Create: Form submit --> POST /api/todos {text, userId} --> Save to MongoDB --> Refresh list

Update: Click edit --> PUT /api/todos/[id] {text} --> Update DB --> Re-fetch list

Delete: Click delete --> DELETE /api/todos/[id] --> Remove from DB --> Refresh list
```

## Key Components
- **Pages:** `todos/page.tsx` (list view), `todos/create/page.tsx` (form).
- **API Routes:** `src/app/api/todos/route.ts` (GET/POST), `todos/[id]/route.ts` (GET/PUT/DELETE).
- **Component:** `src/components/shared/ToDoListView/ToDoListView.tsx` (renders items, buttons).
- **Skeleton:** `TodoSkeleton.tsx` for loading states.
- **Types:** `src/types/todo.ts` (interface Todo).
- **Service:** `getCurrentUser.ts` to get userId for filtering.

## Creating a ToDo
1. After login, navigate to `/todos/create`.
2. Fill the form in `create/page.tsx` (input for task text).
3. Submit POST to `/api/todos`.
4. API: Inserts document with userId, text; returns new ToDo.
5. Redirect to `/todos` to see updated list.

**UI:** Uses `<Input>` and `<Button>` from shadcn/ui.

## Viewing ToDos
1. Visit `/todos`.
2. `page.tsx` fetches data server-side or client-side via `ToDoListView`.
3. Component maps over ToDos, shows text, checkbox for completed, edit/delete buttons.
4. Loading: Shows `TodoSkeleton` while fetching.

**Filter:** Only shows current user's ToDos (query by userId).

## Updating a ToDo
1. In list, click edit button on a ToDo.
2. (Inline edit or modal) Send PUT to `/api/todos/[id]` with updated text/completed.
3. API: Finds by ID, updates fields, returns updated doc.
4. UI refreshes list.

**Note:** Current implementation may use simple text update; extend for completed toggle.

## Deleting a ToDo
1. Click delete button.
2. Confirm (optional), then DELETE to `/api/todos/[id]`.
3. API: Removes document by ID (checks userId ownership).
4. List updates without the item.

## Code Breakdown
### 1. API Route for List/Create (`src/app/api/todos/route.ts`)
```typescript
// Comments explain CRUD operations
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongoDB';
import { getCurrentUser } from '@/service/getCurrentUser';
import { Todo } from '@/types/todo';

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const db = await connectToDatabase();
    const todosCollection = db.collection('todos');
    
    // Fetch user's todos
    const todos: Todo[] = await todosCollection.find({ userId: user.id }).toArray();
    
    return NextResponse.json(todos);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch todos' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser(request);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { text } = await request.json();
    
    const db = await connectToDatabase();
    const todosCollection = db.collection('todos');
    
    // Insert new todo
    const newTodo: Todo = { text, completed: false, userId: user.id };
    const result = await todosCollection.insertOne(newTodo);
    
    const savedTodo = { ...newTodo, _id: result.insertedId };
    return NextResponse.json(savedTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create todo' }, { status: 500 });
  }
}
```
**What it does:** Handles reading and creating ToDos securely.

### 2. API for Single ToDo (`src/app/api/todos/[id]/route.ts`)
```typescript
// Similar structure for update/delete
import { NextRequest, NextResponse } from 'next/server';
// ... imports

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  // Get user, validate ownership, update, return
  // See comments in file for details
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  // Get user, find todo, check userId, delete
}
```
**Comments:** Ensures only owner can modify/delete.

### 3. ToDoListView Component (`src/components/shared/ToDoListView/ToDoListView.tsx`)
```tsx
'use client';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Todo } from '@/types/todo';

interface Props { todos: Todo[]; onUpdate?: (id: string, text: string) => void; onDelete?: (id: string) => void; }

export function ToDoListView({ todos, onUpdate, onDelete }: Props) {
  // Fetch or receive props
  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: 'DELETE' });
    // Refresh list
  };

  return (
    <div className="space-y-4">
      {todos.map(todo => (
        <div key={todo._id} className="flex justify-between items-center p-4 border rounded">
          <span>{todo.text}</span>
          <div>
            <Button onClick={() => onUpdate?.(todo._id as string, 'new text')}>Edit</Button>
            <Button variant="destructive" onClick={() => handleDelete(todo._id as string)}>Delete</Button>
          </div>
        </div>
      ))}
    </div>
  );
}
```
**What it does:** Renders interactive list; handles client actions.

Check inline comments in actual files for more details.

## Testing the ToDo Feature
1. Setup complete? Run `npm run dev`.
2. Login/register.
3. Go to `/todos/create`, add a task (e.g., "Learn Next.js").
4. Visit `/todos`—see the task.
5. Edit/delete it—confirm changes in DB (use MongoDB Compass).
6. Logout/login—ToDos persist.

**Tools:** Browser console for fetch errors; MongoDB Atlas dashboard to view `todos` collection.

## Troubleshooting
- **"Unauthorized" on API:** Ensure logged in; check cookie.
- **Empty List:** Verify userId in DB queries; add console.log in API.
- **Fetch Errors:** Check network tab (F12); ensure API paths correct.
- **No Data Save:** MongoDB connection? See `mongoDB.ts`.
- **UI Not Updating:** Use state management (e.g., useState for todos array).
- **ID Issues:** MongoDB ObjectId; use `new ObjectId(id)` if needed.

Common fix: Restart server, clear browser cache.

## Tips for Beginners
- **State Management:** Use `useState`/`useEffect` for dynamic lists.
- **Async/Await:** All API calls are async; handle loading/errors.
- **Types:** Define `Todo` interface to catch errors early.
- **Debug:** `console.log(todos)` in component to see data.
- **Extensions:** Add "MongoDB for VS Code" to query DB directly.
- **Best Practice:** Always filter by userId to prevent data leaks.
- **Extend:** Add due dates? Update `Todo` type and forms.

**Pro Tip:** For real apps, use optimistic updates (update UI before API response).

## Advanced Notes
- **Performance:** For many ToDos, add pagination (limit/offset in queries).
- **Validation:** Use Zod for input validation in API (e.g., text length).
- **Real-time:** Integrate WebSockets (e.g., Socket.io) for live updates.
- **Indexing:** Add MongoDB index on `userId` for faster queries.
- **Error Handling:** Wrap in try-catch; return user-friendly messages.
- **Limitations:** Current: No search/filter; add in `ToDoListView`.

## Next Steps
- Deploy the app with [DEPLOYMENT.md](DEPLOYMENT.md).
- Customize: Add completed status toggle.
- Learn more: Read Next.js API routes docs.
- Contribute: Add features like task categories.

See [Resources in README.md](../README.md#resources) for tutorials.

Enjoy building your ToDo app! 📝