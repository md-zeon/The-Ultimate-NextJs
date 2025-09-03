/*
### How does the Next.js routing differ from React.js routing?

**ANSWER:**
Next.js uses a **file-system-based router**, where routes are automatically created by the folders and files you add to your `app` directory. This approach is built-in, server-aware, and integrates seamlessly with features like server-side rendering.

In contrast, a typical React.js application uses a **component-based router** (like React Router), where you must install a library and explicitly define your routes within your code using components like `<Route>`. This method is primarily client-side and offers more programmatic flexibility at the cost of manual configuration.

-----

### What is the purpose of route groups, and how can they be created in Next.js?

**ANSWER:**
The purpose of a **route group** is to organize related routes or apply a specific layout to a segment of your application **without affecting the URL structure**. This helps keep your project tidy and allows you to create shared UI for specific sections, like a dashboard or an authentication flow.

You create a route group by wrapping a folder's name in parentheses. For example, creating a folder named `(shop)` will group all the routes inside it, but `(shop)` will not be part of the final URL.

```bash
app/
└── (shop)/          # This is a route group
    ├── layout.tsx   # This layout applies only to routes within (shop)
    └── products/
        └── page.tsx # The URL is still /products, not /(shop)/products
```

-----

### What is a dynamic route, and why should we create dynamic routes in web applications?

**ANSWER:**
A **dynamic route** is a single page template that can render content for multiple URLs based on a variable segment. For example, instead of creating a separate page for every product, you create one dynamic route like `/products/[productId]` that can display details for any product ID.

We create dynamic routes for **scalability** and **maintainability** 👨‍💻. It's impractical to create a separate file for every blog post, user profile, or product in a large application. Dynamic routes allow you to manage a single template file that fetches and displays data based on the URL parameter (e.g., the `productId`), making your codebase dramatically smaller and easier to manage. You create one by wrapping a folder or file name in square brackets, like `[id]`.
*/