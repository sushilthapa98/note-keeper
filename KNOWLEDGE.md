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
