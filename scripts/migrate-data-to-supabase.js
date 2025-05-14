// This script migrates the static property data to Supabase
// Run with: node scripts/migrate-data-to-supabase.js

// Instead of using dotenv, you'll need to set these environment variables manually
// or create a .env file and source it before running this script
const { createClient } = require('@supabase/supabase-js');

// Static data from the application
const properties = {
  newProperties: [
    {
      id: "new-1",
      title: "SKYLINE CONDO",
      location: "สุขุมวิท - กรุงเทพฯ",
      price: "30000",
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
      price: "5000000",
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
      price: "35000",
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
      price: "4500000",
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
      price: "28000",
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
      price: "32500",
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
      price: "45000",
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
      price: "55000",
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
      price: "12500000",
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
      price: "8900000",
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
      price: "6750000",
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
      price: "7500000",
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

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // Use service role key for migration

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Service Key:', supabaseServiceKey ? 'Is set' : 'Not set');

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: Environment variables NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set');
  console.log('You can set them by running:');
  console.log('$env:NEXT_PUBLIC_SUPABASE_URL="your_supabase_url"');
  console.log('$env:SUPABASE_SERVICE_ROLE_KEY="your_service_key"');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Dummy agent ID - in a real app, you would use actual agent IDs
const AGENT_ID = '00000000-0000-0000-0000-000000000000';

async function migrateData() {
  console.log('Starting data migration...');
  
  // Combine all properties
  const allProperties = [
    ...properties.newProperties,
    ...properties.rentalProperties,
    ...properties.saleProperties
  ];
  
  // Process each property
  for (const property of allProperties) {
    try {
      // Determine listing type
      const listingType = [];
      if (property.isForRent) listingType.push('เช่า');
      if (property.isForSale) listingType.push('ขาย');
      
      // Determine property category based on title (simplified)
      let propertyCategory = 'คอนโด';
      if (property.title.includes('VILLA') || property.title.includes('HOME')) {
        propertyCategory = 'บ้านเดี่ยว';
      } else if (property.title.includes('TOWNHOUSE')) {
        propertyCategory = 'ทาวน์เฮาส์';
      }
      
      // Insert into properties table
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
            lat: 13.7563, // Dummy lat/lng for Bangkok
            lng: 100.5018
          }
        })
        .select('id')
        .single();
      
      if (propertyError) {
        console.error(`Error inserting property ${property.id}:`, propertyError);
        continue;
      }
      
      // Insert property details
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
          price: parseInt(property.price.replace(/,/g, ''), 10),
          images: [property.image]
        });
      
      if (detailsError) {
        console.error(`Error inserting property details for ${property.id}:`, detailsError);
        continue;
      }
      
      console.log(`Migrated property: ${property.title}`);
    } catch (error) {
      console.error(`Error processing property ${property.id}:`, error);
    }
  }
  
  console.log('Migration completed!');
}

// Run the migration
migrateData().catch(console.error); 