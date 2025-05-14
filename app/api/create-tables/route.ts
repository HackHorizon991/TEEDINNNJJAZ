import { createClient } from '@/utils/supabase/client';
import { NextResponse } from 'next/server';
import {
    CREATE_AGENTS_TABLE,
    CREATE_PROPERTIES_TABLE,
    CREATE_PROPERTY_DETAILS_TABLE
} from './sql-functions';

export async function GET() {
    try {
        const supabase = createClient();

        console.log("Checking and creating tables if needed...");

        // Check if tables exist
        const { data: tables, error: tablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['agents', 'properties', 'property_details']);

        if (tablesError) {
            console.error("Error checking tables:", tablesError);
            return NextResponse.json({
                success: false,
                error: "Failed to check tables: " + tablesError.message
            }, { status: 500 });
        }

        const existingTables = tables?.map(t => t.table_name) || [];
        console.log("Existing tables:", existingTables);

        // Create tables that don't exist
        const results = [];

        // Create agents table if it doesn't exist
        if (!existingTables.includes('agents')) {
            console.log("Creating agents table...");
            const { error: createAgentsError } = await supabase.rpc('exec_sql', { sql: CREATE_AGENTS_TABLE });

            if (createAgentsError) {
                console.error("Error creating agents table:", createAgentsError);
                results.push({ table: 'agents', success: false, error: createAgentsError.message });
            } else {
                results.push({ table: 'agents', success: true });
            }
        } else {
            results.push({ table: 'agents', success: true, exists: true });
        }

        // Create properties table if it doesn't exist
        if (!existingTables.includes('properties')) {
            console.log("Creating properties table...");
            const { error: createPropertiesError } = await supabase.rpc('exec_sql', { sql: CREATE_PROPERTIES_TABLE });

            if (createPropertiesError) {
                console.error("Error creating properties table:", createPropertiesError);
                results.push({ table: 'properties', success: false, error: createPropertiesError.message });
            } else {
                results.push({ table: 'properties', success: true });
            }
        } else {
            results.push({ table: 'properties', success: true, exists: true });
        }

        // Create property_details table if it doesn't exist
        if (!existingTables.includes('property_details')) {
            console.log("Creating property_details table...");
            const { error: createDetailsError } = await supabase.rpc('exec_sql', { sql: CREATE_PROPERTY_DETAILS_TABLE });

            if (createDetailsError) {
                console.error("Error creating property_details table:", createDetailsError);
                results.push({ table: 'property_details', success: false, error: createDetailsError.message });
            } else {
                results.push({ table: 'property_details', success: true });
            }
        } else {
            results.push({ table: 'property_details', success: true, exists: true });
        }

        // Check if tables were created successfully
        const { data: updatedTables, error: updatedTablesError } = await supabase
            .from('information_schema.tables')
            .select('table_name')
            .eq('table_schema', 'public')
            .in('table_name', ['agents', 'properties', 'property_details']);

        if (updatedTablesError) {
            console.error("Error checking updated tables:", updatedTablesError);
        }

        return NextResponse.json({
            success: true,
            message: "Tables checked and created if needed",
            results: results,
            tables: updatedTables
        });

    } catch (error) {
        console.error("Error in create-tables API:", error);
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
} 