# TEEDIN EASY - Supabase Authentication Setup

## Prerequisites

1. A Supabase account (create one at [supabase.com](https://supabase.com) if you don't have one)
2. A Supabase project created for this app
3. Node.js and pnpm installed

## Setup Instructions

### 1. Install Supabase JS Client

```bash
pnpm add @supabase/supabase-js
```

### 2. Configure Supabase URL and Anon Key

Update the `lib/supabase.ts` file with your Supabase project URL and anon key from the Supabase Dashboard > Project Settings > API.

### 3. Create Database Tables

1. Go to the Supabase Dashboard > SQL Editor
2. Copy and paste the contents of `supabase-setup-revised.sql` and run it to create the required tables and triggers
3. This will set up both the Supabase Auth tables and our custom user tables

### 4. Configure Authentication Settings

1. Go to Authentication > Settings
2. Under "Site URL", enter your application URL (e.g., http://localhost:3000 for local development)
3. Under "Redirect URLs", add your application URL plus any required paths (e.g., http://localhost:3000/\*, http://localhost:3000/reset-password)
4. Configure Email Templates as needed for welcome emails, password recovery, etc.

### 5. Database Schema Structure

The authentication system uses two main tables:

1. `users` - Our custom users table with these fields:
   - `id`: UUID (primary key)
   - `role`: Role of the user ('customer', 'agent', 'admin')
   - `first_name`: User's first nameomer', 'agent', 'admin')
   - `last_name`: User's last nameme
   - `email`: User's email (unique)
   - `phone`: User's phone numbere)
   - `password`: Password (managed by Supabase Auth)
   - `created_at`: Timestamp of user creatione Auth)
   - `created_at`: Timestamp of user creation
2. `profiles` - A linking table between Supabase Auth and our custom users:
   - `id`: UUID (primary key, linked to auth.users)th and our custom users:
   - `user_id`: UUID (foreign key to our custom users table)
   - `first_name`: User's first name our custom users table)
   - `last_name`: User's last nameme
   - `email`: User's emailast name
   - `phone`: User's phone number
   - `user_role`: User's rolember
   - `avatar_url`: URL to user's avatar image
   - `created_at`, `updated_at`: Timestampsge
   - `created_at`, `updated_at`: Timestamps

### 6. Auth Features Available

### 6. Auth Features Available

The authentication system includes:
The authentication system includes:

- User registration with Supabase Auth
- Login with email and passwordse Auth
- Password reset flowd password
- Automatic user profile creation via database triggers
- Custom user roles ('customer', 'agent', 'admin')ggers
- Row-level security policiesr', 'agent', 'admin')
- Session management policies
- Linking between Supabase Auth and custom user records
- Linking between Supabase Auth and custom user records

## TEEDIN EASY Implementation Details

## Usage

### User Authentication Flow

### Auth Context

1. **User Registration:**

   - User fills out the registration form in `register-drawer.tsx`The `AuthProvider` in `contexts/auth-context.tsx` gives you access to authentication state and methods throughout your application. Wrap components that need auth with this provider (already added to root layout).
   - On submit, Supabase Auth creates the user in `auth.users`
   - Database trigger automatically creates entries in our custom `users` and `profiles` tables
   - Email verification is sent to the userimport { useAuth } from "@/contexts/auth-context";

2. **User Login:**

   - User enters credentials in `login-drawer.tsx` const { isLoggedIn, user, login, logout } = useAuth();
   - On successful authentication, application:
     - Gets user data from `profiles` and `users` tables // Use auth functions and state
     - Sets user role and authentication state in the Auth Context
     - Stores session in local storage```

3. **User Logout:**### Authentication Functions
   - User confirms logout in `logout-confirmation-modal.tsx`
   - Authentication state and session are cleareder

### Role-Based Accesstionally render UI elements

- Access `user` for user data
  The application supports multiple user roles:

### Protecting Routes

1. **Customer** - Regular users who can browse properties and make inquiries
2. **Agent** - Real estate agents who can manage their property listingsFor pages that require authentication, check the `isLoggedIn` state:
3. **Admin** - Administrators with full access to the platform

Access control is implemented in both:const { isLoggedIn, loading } = useAuth();

- Front-end components (conditional rendering based on `userRole`)th
- Back-end database policies (row-level security based on user role)if (loading) return <LoadingSpinner />;

### Next Steps logged in

After implementing authentication:
return <Redirect to="/login" />;

1. Configure user profile pages under `/dashboard/[role]` paths}
2. Add permission checks to property listing creation and management
3. Create admin views for user management
4. Implement real-time notifications using Supabase subscriptionsurn <ProtectedContent />;

````
## Usage
## Troubleshooting
### Auth Context

The `AuthProvider` in `contexts/auth-context.tsx` gives you access to authentication state and methods throughout your application. Wrap components that need auth with this provider (already added to root layout).

```jsx- Check if authentication settings are properly configured in Supabase Dashboard











































- Check if authentication settings are properly configured in Supabase Dashboard- Ensure database tables are created correctly- Verify Supabase URL and anon key are correct- Check browser console for errors## Troubleshooting```return <ProtectedContent />;// Show protected content}  return <Redirect to="/login" />;  // Handle unauthorized accessif (!isLoggedIn) {// Redirect if not logged inif (loading) return <LoadingSpinner />;// Show loading state while checking authconst { isLoggedIn, loading } = useAuth();```jsxFor pages that require authentication, check the `isLoggedIn` state:### Protecting Routes- Access `user` for user data- Check `isLoggedIn` to conditionally render UI elements- `logout()` - Sign out the current user- `login(email, password)` - Log in a user### Authentication Functions```}  // Use auth functions and state  const { isLoggedIn, user, login, logout } = useAuth();function MyComponent() {import { useAuth } from "@/contexts/auth-context";
````
