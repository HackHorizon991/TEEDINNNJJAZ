-- Create custom users table for application
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role VARCHAR(10) NOT NULL CHECK (role IN ('customer', 'agent', 'admin')),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  password TEXT NOT NULL CHECK (length(password) >= 8),
  created_at TIMESTAMP DEFAULT now()
);

-- This is a supplementary profiles table that links to auth.users for Supabase Auth integration
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  user_role TEXT DEFAULT 'customer',
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable row level security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles table
CREATE POLICY "Users can view their own profile" 
ON profiles FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON profiles FOR UPDATE 
USING (auth.uid() = id);

CREATE POLICY "Only authenticated users can insert their own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Create policies for users table
CREATE POLICY "Users can view their own user record" 
ON users FOR SELECT 
USING (id IN (SELECT user_id FROM profiles WHERE auth.uid() = profiles.id));

CREATE POLICY "Users can update their own user record" 
ON users FOR UPDATE 
USING (id IN (SELECT user_id FROM profiles WHERE auth.uid() = profiles.id));

CREATE POLICY "Admin can view all users"
ON users FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE auth.uid() = profiles.id AND user_role = 'admin'));

-- Create a trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profiles_timestamp
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE PROCEDURE update_timestamp();

-- Create a function to handle new user signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_user_id UUID;
BEGIN
  -- First create a record in the users table
  INSERT INTO public.users (
    role,
    first_name,
    last_name,
    email,
    phone,
    password
  ) VALUES (
    coalesce(NEW.raw_user_meta_data->>'role', 'customer'),
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    'supabase_managed' -- Password is managed by Supabase auth
  )
  RETURNING id INTO new_user_id;
  
  -- Then create a profile that links the auth.users to our custom users table
  INSERT INTO public.profiles (
    id, 
    user_id,
    first_name,
    last_name,
    email,
    phone,
    user_role,
    avatar_url
  ) VALUES (
    NEW.id,
    new_user_id,
    NEW.raw_user_meta_data->>'first_name',
    NEW.raw_user_meta_data->>'last_name',
    NEW.email,
    NEW.raw_user_meta_data->>'phone',
    coalesce(NEW.raw_user_meta_data->>'user_role', 'customer'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  RETURN NEW;
END;
$$ language 'plpgsql' security definer;

-- Create a trigger to call the handle_new_user function
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
