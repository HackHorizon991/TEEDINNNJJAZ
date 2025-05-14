import { NextResponse } from 'next/server';
import { createServerClient } from '@/utils/supabase/server';
import type { PropertyData } from '@/components/property-card';

// เพิ่ม interface เพื่อขยาย PropertyData ให้รองรับ agentInfo
interface ExtendedPropertyData extends PropertyData {
    agentInfo?: {
        companyName: string;
        licenseNumber: string;
        propertyTypes: string[];
        serviceAreas: string[];
    } | null;
}

// กำหนด interface สำหรับข้อมูลที่ได้จาก Supabase
interface SupabaseProperty {
    id: string;
    agent_id?: string;
    listing_type: string[];
    property_category: string;
    in_project?: boolean;
    rental_duration?: string;
    location?: any;
    created_at: string;
    property_details?: Array<{
        project_name?: string;
        address?: string;
        usable_area?: number;
        bedrooms?: number;
        bathrooms?: number;
        parking_spaces?: number;
        house_condition?: string;
        highlight?: string;
        area_around?: string;
        facilities?: string[];
        project_facilities?: string[];
        description?: string;
        price?: number;
        images?: string[];
    }>;
    agent_info?: {
        company_name?: string;
        license_number?: string;
        property_types?: string[];
        service_areas?: any;
    };
}

export async function GET(request: Request) {
    try {
        console.log("API: เริ่มดึงข้อมูลอสังหาริมทรัพย์จาก server-side");
        const supabase = createServerClient();

        // ตรวจสอบ query parameters
        const url = new URL(request.url);
        const mode = url.searchParams.get('mode');

        // ถ้าเป็นโหมด fallback ให้ดึงข้อมูลแบบแยกตาราง
        if (mode === 'fallback') {
            return await getFallbackData(supabase);
        }

        // ทดสอบการเชื่อมต่อเบื้องต้น
        const connectionTest = await supabase
            .from('properties')
            .select('id')
            .limit(1);

        if (connectionTest.error) {
            console.error("API: ไม่สามารถเชื่อมต่อกับ Supabase:", connectionTest.error);
            return NextResponse.json({
                error: connectionTest.error.message,
                success: false
            }, { status: 500 });
        }

        // แก้ไขการ query โดยดึงข้อมูลแยกกัน
        console.log("API: ดึงข้อมูล properties...");
        const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .limit(12);

        if (propertiesError) {
            console.error("API: เกิดข้อผิดพลาดในการดึงข้อมูล properties:", propertiesError);
            return NextResponse.json({
                error: propertiesError.message,
                success: false
            }, { status: 500 });
        }

        console.log(`API: ดึงข้อมูล properties สำเร็จ จำนวน ${propertiesData?.length || 0} รายการ`);

        // สร้าง array เพื่อเก็บข้อมูลที่สมบูรณ์
        const completeData: SupabaseProperty[] = [];

        // ดึงข้อมูลรายละเอียดและ agent สำหรับแต่ละ property
        for (const property of propertiesData) {
            console.log(`API: ดึงข้อมูลรายละเอียดสำหรับ property ID ${property.id}...`);

            // ดึงข้อมูล property_details
            const { data: detailsData, error: detailsError } = await supabase
                .from('property_details')
                .select('*')
                .eq('property_id', property.id);

            if (detailsError) {
                console.error(`API: เกิดข้อผิดพลาดในการดึงข้อมูล property_details สำหรับ property ID ${property.id}:`, detailsError);
                continue;
            }

            if (!detailsData || detailsData.length === 0) {
                console.log(`API: ไม่พบข้อมูล property_details สำหรับ property ID ${property.id}`);
                continue;
            }

            // ดึงข้อมูล agent (ถ้ามี)
            let agentInfo = null;
            if (property.agent_id) {
                console.log(`API: ดึงข้อมูล agent สำหรับ agent_id ${property.agent_id}...`);
                const { data: agentData, error: agentError } = await supabase
                    .from('agens')
                    .select('*')
                    .eq('user_id', property.agent_id)
                    .single();

                if (!agentError && agentData) {
                    agentInfo = {
                        company_name: agentData.company_name,
                        license_number: agentData.license_number,
                        property_types: agentData.property_types,
                        service_areas: agentData.service_areas
                    };
                } else if (agentError && agentError.code !== 'PGRST116') {
                    console.error(`API: เกิดข้อผิดพลาดในการดึงข้อมูล agent สำหรับ agent_id ${property.agent_id}:`, agentError);
                }
            }

            // สร้างข้อมูลที่สมบูรณ์
            completeData.push({
                ...property,
                property_details: detailsData,
                agent_info: agentInfo
            });
        }

        console.log(`API: รวบรวมข้อมูลสมบูรณ์แล้ว ${completeData.length} รายการ`);

        return NextResponse.json({
            data: completeData,
            success: true
        });
    } catch (error) {
        console.error("API: เกิดข้อผิดพลาดที่ไม่คาดคิด:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
        }, { status: 500 });
    }
}

// ฟังก์ชันสำหรับดึงข้อมูลแบบ fallback (แยกตาราง)
async function getFallbackData(supabase: any) {
    try {
        console.log("API Fallback: กำลังดึงข้อมูลแบบแยกตาราง");

        // ดึงข้อมูลอสังหาริมทรัพย์
        const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .limit(12);

        if (propertiesError || !propertiesData || propertiesData.length === 0) {
            console.error("API Fallback: เกิดข้อผิดพลาดในการดึงข้อมูล properties:", propertiesError);
            return NextResponse.json({
                error: propertiesError?.message || "No properties data",
                success: false
            }, { status: 500 });
        }

        console.log(`API Fallback: ดึงข้อมูล properties สำเร็จ ${propertiesData.length} รายการ`);

        // แปลงข้อมูลเป็น PropertyData
        const transformedData: ExtendedPropertyData[] = [];

        for (const property of propertiesData) {
            // ดึงข้อมูลรายละเอียดอสังหาริมทรัพย์
            const { data: detailData, error: detailError } = await supabase
                .from('property_details')
                .select('*')
                .eq('property_id', property.id)
                .single();

            if (detailError && detailError.code !== 'PGRST116') {
                console.log(`API Fallback: ไม่พบข้อมูลรายละเอียดสำหรับ property ID ${property.id}`);
                continue;
            }

            if (!detailData) continue;

            // ดึงข้อมูลตัวแทน (ถ้ามี)
            let agentData = null;
            if (property.agent_id) {
                const { data: agent, error: agentError } = await supabase
                    .from('agens')
                    .select('*')
                    .eq('user_id', property.agent_id)
                    .single();

                if (!agentError) {
                    agentData = agent;
                }
            }

            // สร้าง PropertyData object
            transformedData.push({
                id: property.id,
                title: detailData.project_name || property.property_category || "Untitled Property",
                location: property.location?.address || detailData.address || "Unknown Location",
                price: detailData.price?.toLocaleString() || "0",
                isPricePerMonth: property.listing_type?.includes("เช่า"),
                details: {
                    area: detailData.usable_area || 0,
                    bedrooms: detailData.bedrooms || 0,
                    bathrooms: detailData.bathrooms || 0,
                    parking: detailData.parking_spaces || 0
                },
                image: detailData.images?.[0] || "/placeholder.svg",
                isForRent: property.listing_type?.includes("เช่า"),
                isForSale: property.listing_type?.includes("ขาย"),
                isTopPick: false,
                description: detailData.description || "",
                highlight: detailData.highlight || "",
                facilities: detailData.facilities || [],
                projectFacilities: detailData.project_facilities || [],
                agentInfo: agentData ? {
                    companyName: agentData.company_name || "",
                    licenseNumber: agentData.license_number || "",
                    propertyTypes: agentData.property_types || [],
                    serviceAreas: agentData.service_areas?.map((sa: any) => `${sa.district}, ${sa.province}`) || []
                } : null
            });
        }

        console.log(`API Fallback: แปลงข้อมูลสำเร็จ ${transformedData.length} รายการ`);

        return NextResponse.json({
            data: transformedData,
            success: true
        });
    } catch (error) {
        console.error("API Fallback: เกิดข้อผิดพลาดที่ไม่คาดคิด:", error);
        return NextResponse.json({
            error: error instanceof Error ? error.message : 'Unknown error',
            success: false
        }, { status: 500 });
    }
} 