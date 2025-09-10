# Setup Guide for Nexen-Next-Basics

This guide is designed for beginners to set up the Nexen-Next-Basics project from scratch. We'll cover everything step by step, including prerequisites, installation, configuration, and running the application. If you're new to development, don't worry—we'll explain each part.

For an overview of the project, see the [README.md](../README.md) in the root directory.

## Table of Contents
- [Prerequisites](#prerequisites)
- [Step 1: Clone the Repository](#step-1-clone-the-repository)
- [Step 2: Install Dependencies](#step-2-install-dependencies)
- [Step 3: Set Up Environment Variables](#step-3-set-up-environment-variables)
- [Step 4: Configure MongoDB](#step-4-configure-mongodb)
- [Step 5: Run the Development Server](#step-5-run-the-development-server)
- [Step 6: Test the Application](#step-6-test-the-application)
- [Troubleshooting](#troubleshooting)
- [Tips for Beginners](#tips-for-beginners)
- [Next Steps](#next-steps)

## Prerequisites
Before starting, ensure you have the following installed on your computer. These are essential tools for running the project.

### 1. Node.js
- **What it is:** Node.js is a runtime environment that allows you to run JavaScript on the server side. This project uses it to run Next.js.
- **Version Required:** 18 or higher.
- **How to Install:**
  - Go to [nodejs.org](https://nodejs.org).
  - Download the LTS (Long Term Support) version for your OS (Windows, macOS, or Linux).
  - Run the installer and follow the prompts.
  - Verify installation: Open a terminal (Command Prompt on Windows, Terminal on macOS/Linux) and run:
    ```
    node --version
    npm --version
    ```
    You should see version numbers (e.g., v20.x.x for Node, 10.x.x for npm).

**Note for Beginners:** npm (Node Package Manager) comes bundled with Node.js. It's used to install project dependencies.

### 2. Git
- **What it is:** Git is a version control system to clone the project code from GitHub or similar.
- **How to Install:**
  - Download from [git-scm.com](https://git-scm.com).
  - Install and verify: `git --version`.
- If you don't have the repo URL, you can download it as a ZIP from GitHub and extract it.

### 3. Code Editor (Recommended: VS Code)
- **What it is:** A text editor for writing and editing code.
- **How to Install:** Download [Visual Studio Code](https://code.visualstudio.com) from the official site.
- **Extensions for Beginners:**
  - Install "ES7+ React/Redux/React-Native snippets" for faster coding.
  - "Tailwind CSS IntelliSense" for styling help.
  - "Thunder Client" to test API endpoints easily.

### 4. MongoDB Account
- **What it is:** MongoDB is a NoSQL database to store user data and todos.
- **We'll set this up in Step 4.**

**Tip:** If you're on Windows, use Command Prompt or PowerShell. On macOS/Linux, use the built-in Terminal.

## Step 1: Clone the Repository
1. Open your terminal.
2. Navigate to where you want to store the project (e.g., Desktop):
   ```
   cd Desktop
   ```
3. Clone the project (replace `<repo-url>` with the actual GitHub URL if available; otherwise, download ZIP):
   ```
   git clone <repo-url>
   ```
   Or, if no repo: Download ZIP from GitHub, extract to `Nexen-Next-Basics` folder.
4. Enter the project directory:
   ```
   cd Nexen-Next-Basics
   ```

**What this does:** This copies all the project files to your computer.

## Step 2: Install Dependencies
Dependencies are libraries the project needs (listed in `package.json`).

1. In the terminal, inside the project folder, run:
   ```
   npm install
   ```
   - This downloads and installs packages like Next.js, React, MongoDB driver, etc., into a `node_modules/` folder.
   - It may take a few minutes. You'll see progress in the terminal.

**For Beginners:** If you get errors like "permission denied," try running as administrator (right-click Command Prompt > Run as administrator on Windows).

**Additional Installs (if not already in package.json):**
- MongoDB: `npm install mongodb`
- Types: `npm install --save-dev @types/mongodb`

## Step 3: Set Up Environment Variables
Environment variables store sensitive info like database URLs securely.

1. Create a file named `.env.local` in the root directory (same level as `package.json`).
   - In VS Code: Right-click in explorer > New File > `.env.local`.
2. Add the following line (replace with your actual MongoDB URI from Step 4):
   ```
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/your-db-name?retryWrites=true&w=majority
   ```
3. Save the file.

**Important Note:** `.env.local` is gitignored, so it's not committed to version control. Never share your URI publicly.

**For Beginners:** Environment variables keep secrets out of code. Next.js loads them automatically.

## Step 4: Configure MongoDB
1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and sign up for a free account.
2. Create a new cluster:
   - Click "Build a Database" > Free tier > Create.
   - Choose a provider (e.g., AWS) and region.
3. Set up access:
   - Under "Database Access," create a new database user (username/password).
   - Under "Network Access," add your IP (0.0.0.0/0 for anywhere, but restrict in production).
4. Get the connection string:
   - Under "Clusters," click "Connect" > "Drivers" > Copy the URI.
   - Replace `<password>` with your user's password.
   - Add database name if needed (e.g., `nexenbasics`).
5. Paste into `.env.local` as `MONGODB_URI`.

**Test Connection:** The project uses `src/lib/mongoDB.ts` to connect. If issues, check the file's comments.

**Alternative for Local Dev:** Install MongoDB locally via [MongoDB Community](https://www.mongodb.com/try/download/community), run `mongod`, and use `mongodb://localhost:27017/nexenbasics`.

## Step 5: Run the Development Server
1. In the terminal (project root):
   ```
   npm run dev
   ```
   - This starts the Next.js server on http://localhost:3000.
   - You'll see output like "Local: http://localhost:3000" and "Ready in xxxms".

**What this does:** The dev server watches for file changes and auto-reloads the browser.

**Other Scripts:**
- `npm run build`: Builds for production.
- `npm start`: Runs the built app.
- `npm run lint`: Checks code quality.

## Step 6: Test the Application
1. Open your browser and go to [http://localhost:3000](http://localhost:3000).
2. You should see the home page.
3. Test auth: Go to `/register`, create a user, then `/login`.
4. Go to `/todos` (after login) to see the ToDo list.
5. Create a todo to verify database connection.

**Success Indicators:**
- No errors in terminal.
- Pages load without crashes.
- Todos save/retrieve from DB.

## Troubleshooting
- **"Module not found" Error:** Run `npm install` again.
- **MongoDB Connection Failed:** Check URI in `.env.local`, ensure Atlas IP access, verify credentials.
- **Port 3000 in Use:** Kill process or run `npm run dev -- -p 3001`.
- **TypeScript Errors:** Run `npm run lint` or check `tsconfig.json`.
- **Windows Path Issues:** Use forward slashes in paths.
- **Slow Install:** Use `npm install --legacy-peer-deps` if peer dep warnings.
- **No Styles:** Ensure Tailwind is installed (via shadcn/ui).

If stuck, check console (F12 in browser) or server terminal for errors. Search Stack Overflow with the error message.

**Pro Tip:** Use VS Code's integrated terminal (Ctrl+` ) for easier navigation.

## Tips for Beginners
- **Understand Commands:** `npm` is like "install this package." Read `package.json` scripts section.
- **File Structure:** See [README.md](../README.md#project-structure) for explanations.
- **Debugging:** Add `console.log('Debug message')` in code and check terminal/browser console.
- **Version Control:** After setup, run `git add . && git commit -m "Initial setup"`.
- **Learning Resources:** Watch "Next.js Crash Course" on YouTube.
- **Backup:** Copy `.env.local` securely before deleting.
- **Updates:** To update dependencies: `npm update`.

## Next Steps
- Explore [AUTHENTICATION.md](AUTHENTICATION.md) for login/register details.
- Learn about [TODOS.md](TODOS.md) functionality.
- Deploy with [DEPLOYMENT.md](DEPLOYMENT.md).
- Customize: Edit `app/page.tsx` and see changes live!

If you have questions, refer to the [Resources section in README.md](../README.md#resources).

Happy coding! 🚀