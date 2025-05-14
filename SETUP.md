# Setting up Teedin with Supabase

This guide will help you set up the Teedin real estate platform with Supabase as the backend database.

## 1. Create a Supabase Project

1. Go to [Supabase](https://supabase.com/) and sign up or log in
2. Create a new project
3. Take note of your project URL and API keys (anon key and service role key)

## 2. Set Up Database Tables

Run the following SQL in the Supabase SQL editor:

```sql
-- Create users table (if not exists)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Create properties table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES users(id) ON DELETE CASCADE,
    listing_type TEXT[] NOT NULL, -- ARRAY เช่น ["ขาย", "เช่า"]
    property_category VARCHAR(50) NOT NULL, -- เช่น บ้านเดี่ยว, คอนโด
    in_project BOOLEAN,
    rental_duration VARCHAR(20), -- เช่น 3 เดือน, 6 เดือน, อื่นๆ
    location JSONB, -- เก็บข้อมูลแผนที่ เช่น lat, lng, address
    created_at TIMESTAMP DEFAULT now()
);

-- Create property details table
CREATE TABLE property_details (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    project_name VARCHAR(255),
    address TEXT,
    usable_area FLOAT, -- พื้นที่ใช้สอย ตร.ม.
    bedrooms INT,
    bathrooms INT,
    parking_spaces INT,
    house_condition TEXT,
    highlight TEXT,
    area_around TEXT,
    facilities TEXT[],
    project_facilities TEXT[],
    description TEXT,
    price NUMERIC(12,2),
    images TEXT[] -- URL ของรูปภาพ jpg/png (สูงสุด 6 รูป)
);

-- Create a dummy user for testing
INSERT INTO users (id, email, name) 
VALUES ('00000000-0000-0000-0000-000000000000', 'test@example.com', 'Test Agent');
```

## 3. Set Up Environment Variables

Create a `.env.local` file in the project root with the following content:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

Replace the placeholder values with your actual Supabase credentials.

## 4. Migrate Sample Data

To populate your Supabase database with sample property data:

1. Set the environment variables:
   ```
   # PowerShell
   $env:NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   $env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   
   # Bash
   export NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"
   export SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"
   ```

2. Run the migration script:
   ```
   node scripts/migrate-data-to-supabase.js
   ```

## 5. Run the Application

Start the development server:

```
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 6. Verify Data

Check that your properties are loading from Supabase instead of the static data files. You should see the same properties as before, but now they're coming from your database. 