// สคริปต์นำเข้าข้อมูลอสังหาริมทรัพย์จาก data/properties.ts เข้าสู่ Supabase
// คำสั่งรัน: node scripts/migrate-data-to-supabase-fixed.js

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// ข้อมูลอสังหาริมทรัพย์จาก data/properties.ts
const properties = {
  newProperties: [
    {
      id: "new-1",
      title: "SKYLINE CONDO",
      location: "สุขุมวิท - กรุงเทพฯ",
      price: "30,000",
      isPricePerMonth: true,
      details: {
        area: 850,
        bedrooms: 2,
        bathrooms: 4,
        parking: 2,
      },
      image: "/properties/new-property-1.jpg",
      isForRent: true,
      isTopPick: true,
    },
    {
      id: "new-2",
      title: "MODERN LOFT",
      location: "สาทร - กรุงเทพฯ",
      price: "5,000,000",
      details: {
        area: 920,
        bedrooms: 3,
        bathrooms: 3,
        parking: 1,
      },
      image: "/properties/new-property-2.jpg",
      isForSale: true,
      isTopPick: true,
    },
    {
      id: "new-3",
      title: "POOL VILLA",
      location: "หัวหิน - ประจวบคีรีขันธ์",
      price: "35,000",
      isPricePerMonth: true,
      details: {
        area: 1200,
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
      },
      image: "/properties/new-property-3.jpg",
      isForRent: true,
      isTopPick: true,
    },
    {
      id: "new-4",
      title: "GARDEN VIEW HOME",
      location: "รามอินทรา - กรุงเทพฯ",
      price: "4,500,000",
      details: {
        area: 780,
        bedrooms: 2,
        bathrooms: 2,
        parking: 1,
      },
      image: "/properties/new-property-4.jpg",
      isForSale: true,
      isTopPick: true,
    },
  ],
  rentalProperties: [
    {
      id: "rent-1",
      title: "CITY STUDIO",
      location: "อโศก - กรุงเทพฯ",
      price: "28,000",
      isPricePerMonth: true,
      details: {
        area: 650,
        bedrooms: 1,
        bathrooms: 1,
        parking: 1,
      },
      image: "/properties/rental-1.jpg",
      isForRent: true,
      isTopPick: true,
    },
    {
      id: "rent-2",
      title: "FAMILY APARTMENT",
      location: "พระราม 9 - กรุงเทพฯ",
      price: "32,500",
      isPricePerMonth: true,
      details: {
        area: 950,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
      },
      image: "/properties/rental-2.jpg",
      isForRent: true,
      isTopPick: true,
    },
    {
      id: "rent-3",
      title: "RIVER VIEW SUITE",
      location: "เจริญกรุง - กรุงเทพฯ",
      price: "45,000",
      isPricePerMonth: true,
      details: {
        area: 1050,
        bedrooms: 2,
        bathrooms: 2,
        parking: 2,
      },
      image: "/properties/rental-3.jpg",
      isForRent: true,
      isTopPick: true,
    },
    {
      id: "rent-4",
      title: "LUXURY TOWNHOUSE",
      location: "ทองหล่อ - กรุงเทพฯ",
      price: "55,000",
      isPricePerMonth: true,
      details: {
        area: 1250,
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
      },
      image: "/properties/rental-4.jpg",
      isForRent: true,
      isTopPick: true,
    },
  ],
  saleProperties: [
    {
      id: "sale-1",
      title: "URBAN PENTHOUSE",
      location: "สีลม - กรุงเทพฯ",
      price: "12,500,000",
      details: {
        area: 1350,
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
      },
      image: "/properties/sale-1.jpg",
      isForSale: true,
      isTopPick: true,
    },
    {
      id: "sale-2",
      title: "MODERN VILLA",
      location: "พัฒนาการ - กรุงเทพฯ",
      price: "8,900,000",
      details: {
        area: 1200,
        bedrooms: 4,
        bathrooms: 3,
        parking: 2,
      },
      image: "/properties/sale-2.jpg",
      isForSale: true,
      isTopPick: true,
    },
    {
      id: "sale-3",
      title: "FAMILY ESTATE",
      location: "บางนา - กรุงเทพฯ",
      price: "6,750,000",
      details: {
        area: 980,
        bedrooms: 3,
        bathrooms: 3,
        parking: 2,
      },
      image: "/properties/sale-3.jpg",
      isForSale: true,
      isTopPick: true,
    },
    {
      id: "sale-4",
      title: "GARDEN RESIDENCE",
      location: "ลาดพร้าว - กรุงเทพฯ",
      price: "7,500,000",
      details: {
        area: 1050,
        bedrooms: 3,
        bathrooms: 2,
        parking: 1,
      },
      image: "/properties/sale-4.jpg",
      isForSale: true,
      isTopPick: true,
    },
  ]
};

// สร้าง Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // ใช้ service role key สำหรับการนำเข้าข้อมูล

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Key:', supabaseServiceKey ? 'Is set' : 'Not set');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: ต้องตั้งค่า environment variables NEXT_PUBLIC_SUPABASE_URL และ SUPABASE_SERVICE_ROLE_KEY');
  console.log('คุณสามารถตั้งค่าได้โดยการรัน:');
  console.log('# PowerShell');
  console.log('$env:NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"');
  console.log('$env:SUPABASE_SERVICE_ROLE_KEY="your_service_role_key"');
  console.log('# หรือ CMD');
  console.log('set NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ID ของเอเจนต์ที่จะใช้
const AGENT_ID = '00000000-0000-0000-0000-000000000000';

// ฟังก์ชันสำหรับอัปโหลดรูปภาพไปยัง Supabase Storage
async function uploadImage(localImagePath, propertyId) {
  try {
    // ตัดเอาเฉพาะชื่อไฟล์
    const fileName = path.basename(localImagePath);
    
    // เส้นทางไฟล์ในเครื่อง
    const fullLocalPath = path.join(process.cwd(), 'public', localImagePath);
    
    // ตรวจสอบว่าไฟล์มีอยู่จริงหรือไม่
    if (!fs.existsSync(fullLocalPath)) {
      console.warn(`ไม่พบไฟล์: ${fullLocalPath}`);
      return null;
    }
    
    // อ่านไฟล์
    const fileBuffer = fs.readFileSync(fullLocalPath);
    
    // อัปโหลดไปยัง Supabase Storage
    const { data, error } = await supabase
      .storage
      .from('property-images')
      .upload(`properties/${propertyId}/${fileName}`, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true
      });
    
    if (error) {
      console.error(`เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ ${fileName}:`, error);
      return null;
    }
    
    // สร้าง URL สาธารณะ
    const { data: publicUrlData } = supabase
      .storage
      .from('property-images')
      .getPublicUrl(`properties/${propertyId}/${fileName}`);
    
    return publicUrlData.publicUrl;
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ:', error);
    return null;
  }
}

// ฟังก์ชันหลักสำหรับนำเข้าข้อมูล
async function migrateData() {
  console.log('เริ่มต้นการนำเข้าข้อมูล...');
  
  // ตรวจสอบและสร้างผู้ใช้ (agent)
  console.log('กำลังตรวจสอบและสร้างผู้ใช้...');
  
  try {
    // ตรวจสอบว่ามีผู้ใช้อยู่แล้วหรือไม่
    const { data: existingUser, error: userCheckError } = await supabase
      .from('users')
      .select('id')
      .eq('id', AGENT_ID)
      .single();
    
    if (userCheckError && userCheckError.code !== 'PGRST116') {
      console.error('เกิดข้อผิดพลาดในการตรวจสอบผู้ใช้:', userCheckError);
    }
    
    if (!existingUser) {
      // สร้างผู้ใช้ใหม่
      const { data: newUser, error: createUserError } = await supabase
        .from('users')
        .insert({
          id: AGENT_ID,
          email: 'test@example.com',
          name: 'Test Agent'
        })
        .select()
        .single();
      
      if (createUserError) {
        console.error('เกิดข้อผิดพลาดในการสร้างผู้ใช้:', createUserError);
        if (createUserError.message.includes('duplicate key value')) {
          console.log('ผู้ใช้มีอยู่แล้ว แต่ไม่สามารถดึงข้อมูลได้ ดำเนินการต่อ...');
        } else {
          console.error('ไม่สามารถสร้างผู้ใช้ได้ ยกเลิกการนำเข้าข้อมูล');
          return;
        }
      } else {
        console.log('สร้างผู้ใช้สำเร็จ:', newUser.id);
      }
    } else {
      console.log('พบผู้ใช้อยู่แล้ว:', existingUser.id);
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบหรือสร้างผู้ใช้:', error);
    console.log('พยายามดำเนินการต่อ...');
  }
  
  // สร้าง bucket สำหรับเก็บรูปภาพ
  try {
    console.log('กำลังตรวจสอบและสร้าง bucket สำหรับเก็บรูปภาพ...');
    
    // ตรวจสอบว่ามี bucket อยู่แล้วหรือไม่
    const { data: buckets, error: listBucketsError } = await supabase
      .storage
      .listBuckets();
    
    if (listBucketsError) {
      console.error('เกิดข้อผิดพลาดในการตรวจสอบ buckets:', listBucketsError);
    } else {
      const propertyImagesBucketExists = buckets.some(bucket => bucket.name === 'property-images');
      
      if (!propertyImagesBucketExists) {
        // สร้าง bucket ใหม่
        const { error: createBucketError } = await supabase
          .storage
          .createBucket('property-images', {
            public: true,
            allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg'],
            fileSizeLimit: 10485760, // 10MB
          });
        
        if (createBucketError) {
          console.error('เกิดข้อผิดพลาดในการสร้าง bucket:', createBucketError);
          console.log('อาจต้องสร้าง bucket ด้วยตนเองในหน้า Supabase Storage');
        } else {
          console.log('สร้าง bucket "property-images" สำเร็จ');
        }
      } else {
        console.log('พบ bucket "property-images" อยู่แล้ว');
      }
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตรวจสอบหรือสร้าง bucket:', error);
    console.log('พยายามดำเนินการต่อ...');
  }
  
  // ตั้งค่า RLS (Row Level Security) สำหรับ bucket
  try {
    console.log('กำลังตั้งค่าสิทธิ์การเข้าถึง bucket...');
    
    // ตั้งค่า policy ให้สามารถเข้าถึง bucket ได้
    const { error: policyError } = await supabase
      .rpc('create_storage_policy', {
        bucket_name: 'property-images',
        policy_name: 'public_access',
        definition: 'true', // อนุญาตให้ทุกคนเข้าถึงได้
        operation: 'ALL' // อนุญาตทุกการดำเนินการ
      });
    
    if (policyError) {
      console.error('เกิดข้อผิดพลาดในการตั้งค่าสิทธิ์การเข้าถึง bucket:', policyError);
      console.log('อาจต้องตั้งค่าสิทธิ์ด้วยตนเองในหน้า Supabase Storage');
    } else {
      console.log('ตั้งค่าสิทธิ์การเข้าถึง bucket สำเร็จ');
    }
  } catch (error) {
    console.error('เกิดข้อผิดพลาดในการตั้งค่าสิทธิ์การเข้าถึง bucket:', error);
    console.log('พยายามดำเนินการต่อ...');
  }
  
  // รวมข้อมูลอสังหาริมทรัพย์ทั้งหมด
  const allProperties = [
    ...properties.newProperties,
    ...properties.rentalProperties,
    ...properties.saleProperties
  ];
  
  // ประมวลผลแต่ละรายการ
  for (const property of allProperties) {
    try {
      // กำหนดประเภทรายการ
      const listingType = [];
      if (property.isForRent) listingType.push('เช่า');
      if (property.isForSale) listingType.push('ขาย');
      
      // กำหนดประเภทอสังหาริมทรัพย์ตามชื่อ (อย่างง่าย)
      let propertyCategory = 'คอนโด';
      if (property.title.includes('VILLA') || property.title.includes('HOME') || property.title.includes('ESTATE')) {
        propertyCategory = 'บ้านเดี่ยว';
      } else if (property.title.includes('TOWNHOUSE')) {
        propertyCategory = 'ทาวน์เฮาส์';
      } else if (property.title.includes('PENTHOUSE')) {
        propertyCategory = 'เพนท์เฮาส์';
      } else if (property.title.includes('LOFT')) {
        propertyCategory = 'ลอฟท์';
      }
      
      // เพิ่มข้อมูลในตาราง properties
      const { data: propertyData, error: propertyError } = await supabase
        .from('properties')
        .insert({
          agent_id: AGENT_ID,
          listing_type: listingType,
          property_category: propertyCategory,
          in_project: true,
          rental_duration: property.isPricePerMonth ? '1 เดือน' : null,
          location: {
            address: property.location,
            lat: 13.7563, // พิกัดตัวอย่างสำหรับกรุงเทพฯ
            lng: 100.5018
          }
        })
        .select('id')
        .single();
      
      if (propertyError) {
        console.error(`เกิดข้อผิดพลาดในการเพิ่มอสังหาริมทรัพย์ ${property.id}:`, propertyError);
        continue;
      }
      
      // อัปโหลดรูปภาพไปยัง Supabase Storage
      console.log(`กำลังอัปโหลดรูปภาพสำหรับ ${property.title}...`);
      const imageUrl = await uploadImage(property.image, propertyData.id);
      
      // แปลงราคาจาก string เป็น number
      const priceValue = parseFloat(property.price.replace(/,/g, ''));
      
      // เพิ่มรายละเอียดอสังหาริมทรัพย์
      const { error: detailsError } = await supabase
        .from('property_details')
        .insert({
          property_id: propertyData.id,
          project_name: property.title,
          address: property.location,
          usable_area: property.details.area,
          bedrooms: property.details.bedrooms,
          bathrooms: property.details.bathrooms,
          parking_spaces: property.details.parking,
          house_condition: 'ดี',
          highlight: `${property.title} - ${property.location}`,
          area_around: 'ใกล้ห้างสรรพสินค้า, ใกล้รถไฟฟ้า',
          facilities: ['เฟอร์นิเจอร์', 'เครื่องปรับอากาศ'],
          project_facilities: ['สระว่ายน้ำ', 'ฟิตเนส', 'รปภ. 24 ชม.'],
          description: `${property.title} ตั้งอยู่ที่ ${property.location} เป็นที่พักอาศัยที่สะดวกสบาย`,
          price: priceValue,
          images: imageUrl ? [imageUrl] : []
        });
      
      if (detailsError) {
        console.error(`เกิดข้อผิดพลาดในการเพิ่มรายละเอียดอสังหาริมทรัพย์สำหรับ ${property.id}:`, detailsError);
        continue;
      }
      
      console.log(`นำเข้าข้อมูลอสังหาริมทรัพย์สำเร็จ: ${property.title}`);
    } catch (error) {
      console.error(`เกิดข้อผิดพลาดในการประมวลผลอสังหาริมทรัพย์ ${property.id}:`, error);
    }
  }
  
  console.log('การนำเข้าข้อมูลเสร็จสมบูรณ์!');
}

// รันการนำเข้าข้อมูล
migrateData().catch(console.error); 