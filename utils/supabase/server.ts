import { createClient } from '@supabase/supabase-js';

// ใช้ค่า URL และ key เดียวกับใน lib/supabase.ts
const supabaseUrl = 'https://kxkryylxfkkjgbgtxfog.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3J5eWx4ZmtramdiZ3R4Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDA1ODMsImV4cCI6MjA2MjM3NjU4M30.CDUqZSXA8IxaUBUU7tcxDXn7qyM4i6pma_3dURjvmyU';

// สร้าง Supabase client สำหรับใช้งานบน server-side
export const createServerClient = () => {
    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key must be defined');
    }

    const client = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
            detectSessionInUrl: false
        },
        db: {
            schema: 'public'
        }
    });

    return client;
}; 