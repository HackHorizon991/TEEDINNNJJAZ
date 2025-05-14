import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// สร้าง flag สำหรับตรวจสอบสถานะการเชื่อมต่อ
let isOnline = true;
let lastConnectionCheck = 0;

// ตรวจสอบการเชื่อมต่ออินเทอร์เน็ต
const checkConnection = async (): Promise<boolean> => {
    // ตรวจสอบทุก 10 วินาทีเท่านั้น
    const now = Date.now();
    if (now - lastConnectionCheck < 10000) {
        return isOnline;
    }

    lastConnectionCheck = now;

    try {
        // ทดสอบเชื่อมต่อกับ Google (เป็น endpoint ที่มีความเสถียรสูง)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch('https://www.google.com/generate_204', {
            method: 'HEAD',
            mode: 'no-cors',
            signal: controller.signal
        });

        clearTimeout(timeoutId);
        isOnline = true;
        console.log('Internet connection available');
        return true;
    } catch (error) {
        isOnline = false;
        console.log('No internet connection available');
        return false;
    }
};

// Create a Supabase client for use in the browser
export const createClient = () => {
    // ใช้ค่า URL และ key จาก lib/supabase.ts เพื่อให้ใช้การเชื่อมต่อเดียวกัน
    const supabaseUrl = 'https://kxkryylxfkkjgbgtxfog.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3J5eWx4ZmtramdiZ3R4Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDA1ODMsImV4cCI6MjA2MjM3NjU4M30.CDUqZSXA8IxaUBUU7tcxDXn7qyM4i6pma_3dURjvmyU';

    console.log("Creating Supabase client with:", {
        supabaseUrl,
        hasAnonKey: !!supabaseAnonKey,
        anonKeyLength: supabaseAnonKey?.length
    });

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Supabase URL and Anon Key must be defined');
    }

    // Custom fetch function with retry logic
    const fetchWithRetry = async (url: RequestInfo | URL, options: RequestInit & { timeout?: number } = {}): Promise<Response> => {
        const { timeout = 30000, ...fetchOptions } = options;

        // ตรวจสอบการเชื่อมต่อก่อน
        const connected = await checkConnection();
        if (!connected) {
            throw new Error('No internet connection available');
        }

        // Maximum number of retry attempts
        const MAX_RETRIES = 3;
        let retries = 0;
        let lastError: Error = new Error("Unknown error occurred");

        while (retries < MAX_RETRIES) {
            try {
                console.log(`Attempting fetch to ${typeof url === 'string' ? url : url.toString()}, attempt ${retries + 1}/${MAX_RETRIES}`);

                // Create an AbortController to handle timeout
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), timeout);

                // ปรับ mode เป็น 'cors' เพื่อให้สามารถเชื่อมต่อกับ Supabase API ได้
                const response = await fetch(url, {
                    ...fetchOptions,
                    signal: controller.signal,
                    mode: 'cors',
                    cache: 'no-cache' // ไม่ใช้ cache เพื่อหลีกเลี่ยงปัญหา
                });

                // Clear the timeout
                clearTimeout(timeoutId);

                console.log(`Fetch successful, status: ${response.status}`);
                return response;
            } catch (err) {
                const error = err instanceof Error ? err : new Error(String(err));
                lastError = error;
                retries++;
                console.log(`Fetch attempt ${retries} failed: ${error.message}. ${retries < MAX_RETRIES ? 'Retrying...' : 'Giving up.'}`);

                // Wait before retrying (exponential backoff)
                if (retries < MAX_RETRIES) {
                    const backoffTime = 1000 * Math.pow(2, retries);
                    console.log(`Waiting ${backoffTime}ms before retry...`);
                    await new Promise(resolve => setTimeout(resolve, backoffTime));
                }
            }
        }

        throw lastError;
    };

    try {
        const client = createSupabaseClient(supabaseUrl, supabaseAnonKey, {
            auth: {
                persistSession: true,
                autoRefreshToken: true,
                detectSessionInUrl: true
            },
            global: {
                fetch: fetchWithRetry
            },
            db: {
                schema: 'public'
            }
        });

        // Add error logging for debugging
        console.log("Supabase client created successfully");

        return client;
    } catch (error) {
        console.error("Failed to create Supabase client:", error);
        throw error;
    }
}; 