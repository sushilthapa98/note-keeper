## How to do Authentication

- Create a login Form
- After form submit, validate user data and check if user exists in database
- If user exists, compare password using bcrypt
- If password is correct, create a session and store it in a cookie
- Use this cookie to authenticate the user (eg. in middleware, server actions)
- Create a logout button to delete the session

### How to create session

- Session can be created in two ways: Stateless(data stored in browser cookie) and Database (data stored in database)
- Create encrypt, decrypt, createSession, updateSession, deleteSession methods
- You can use library like 'jose' to create and verify JWT tokens
- Use cookies() in nextjs to create and update cookies
- Note: cookies are sent in every http request

## How to use Next Auth

- Create route.ts file in app/api/auth/[...nextauth]/route.ts to catch all auth related requests
- Create auth.ts file in root directory and configure auth with providers, callbacks, etc.
- You can use providers like Google, Credentials, etc.
- use signIn method to sign in user along with options (eg. signIn('google', { redirectTo: '/dashboard' }))
- Use signIn method to handle custom logic for database operation when using provider (eg. creating user in database after google sign in)
- Create a middleware.ts file in app directory to protect routes
- Use auth() in server components, server actions, route handlers to get session
- Use useSession() in client components to get session (for this SessionProvider must be wrapped around the app, it must be a client component so separate Provider client component is required to use it in layout file)

## How to use type checking, linting and formatting

- Use tsc --noEmit to check for type errors (as configuration defined in tsconfig.json)
- Use eslint to check for lint errors (optionally add cache '--cache --cache-location .eslintcache' for performance)
- Use eslint --fix to fix lint errors
- Use prettier --write "\*_/_.{ts,tsx,md,json,css}" to format the code (formats based on .prettierrc file)

## Using husky pre commit hook with lint-staged for better code quality

- Install and setup husky
- Add your commands in pre-commit file inside .husky
- Add lint-staged configuration in package.json or a separate .lintstagedrc file
- Example Script of pre-commit:

```
npm run type-check // type check in pre-commit instead defining it in lint staged to prevent errors
npx lint-staged
```
