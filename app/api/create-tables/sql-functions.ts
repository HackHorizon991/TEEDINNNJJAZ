// SQL functions for creating tables in Supabase

export const CREATE_AGENTS_TABLE = `
CREATE TABLE IF NOT EXISTS agents (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    company_name VARCHAR(255),
    license_number VARCHAR(50),
    national_id VARCHAR(20) NOT NULL,
    address TEXT NOT NULL,
    property_types TEXT[], 
    service_areas JSONB,
    verification_documents TEXT[]
);
`;

export const CREATE_PROPERTIES_TABLE = `
CREATE TABLE IF NOT EXISTS properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    agent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    listing_type TEXT[] NOT NULL,
    property_category VARCHAR(50) NOT NULL,
    in_project BOOLEAN,
    rental_duration VARCHAR(20),
    location JSONB,
    created_at TIMESTAMP DEFAULT now()
);
`;

export const CREATE_PROPERTY_DETAILS_TABLE = `
CREATE TABLE IF NOT EXISTS property_details (
    property_id UUID PRIMARY KEY REFERENCES properties(id) ON DELETE CASCADE,
    project_name VARCHAR(255),
    address TEXT,
    usable_area FLOAT,
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
    images TEXT[]
);
`;

export const CREATE_SQL_FUNCTIONS = `
-- Function to create agents table
CREATE OR REPLACE FUNCTION create_agents_table()
RETURNS void AS $$
BEGIN
    ${CREATE_AGENTS_TABLE.replace(/`/g, '\'')}
END;
$$ LANGUAGE plpgsql;

-- Function to create properties table
CREATE OR REPLACE FUNCTION create_properties_table()
RETURNS void AS $$
BEGIN
    ${CREATE_PROPERTIES_TABLE.replace(/`/g, '\'')}
END;
$$ LANGUAGE plpgsql;

-- Function to create property_details table
CREATE OR REPLACE FUNCTION create_property_details_table()
RETURNS void AS $$
BEGIN
    ${CREATE_PROPERTY_DETAILS_TABLE.replace(/`/g, '\'')}
END;
$$ LANGUAGE plpgsql;
`; 