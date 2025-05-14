import { createClient } from '@supabase/supabase-js';

// กำหนดค่า URL และ ANON_KEY โดยตรงเพื่อทดสอบ (แนะนำให้ใช้ environment variables ในโปรดักชั่น)
// ไปที่ Project Settings > API ในแดชบอร์ด Supabase เพื่อคัดลอกค่าเหล่านี้
const supabaseUrl = 'https://kxkryylxfkkjgbgtxfog.supabase.co';  // แก้ไขเป็น URL จริงของคุณ
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt4a3J5eWx4ZmtramdiZ3R4Zm9nIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4MDA1ODMsImV4cCI6MjA2MjM3NjU4M30.CDUqZSXA8IxaUBUU7tcxDXn7qyM4i6pma_3dURjvmyU';  // แก้ไขเป็น Anon Key จริงของคุณ

export const supabase = createClient(supabaseUrl, supabaseAnonKey);