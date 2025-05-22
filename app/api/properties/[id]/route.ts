import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // Fetch property details with related data
        const { data: property, error } = await supabase
            .from('properties')
            .select(`
                *,
                property_details (
                    project_name,
                    address,
                    usable_area,
                    bedrooms,
                    bathrooms,
                    parking_spaces,
                    house_condition,
                    highlight,
                    area_around,
                    facilities,
                    project_facilities,
                    description,
                    price,
                    images,
                    latitude,
                    longitude
                )
            `)
            .eq('id', params.id)
            .single()

        if (error) {
            console.error('Error fetching property:', error)
            return NextResponse.json(
                { error: 'Failed to fetch property details' },
                { status: 500 }
            )
        }

        if (!property) {
            return NextResponse.json(
                { error: 'Property not found' },
                { status: 404 }
            )
        }

        // Transform the data to match the expected format
        const transformedProperty = {
            property_id: property.id,
            project_name: property.property_details?.project_name || property.property_category,
            address: property.property_details?.address || '',
            usable_area: property.property_details?.usable_area || 0,
            bedrooms: property.property_details?.bedrooms || 0,
            bathrooms: property.property_details?.bathrooms || 0,
            parking_spaces: property.property_details?.parking_spaces || 0,
            house_condition: property.property_details?.house_condition || '',
            highlight: property.property_details?.highlight || '',
            area_around: property.property_details?.area_around || '',
            facilities: property.property_details?.facilities || [],
            project_facilities: property.property_details?.project_facilities || [],
            description: property.property_details?.description || '',
            price: property.property_details?.price?.toString() || '0',
            images: property.property_details?.images || [],
            latitude: property.property_details?.latitude,
            longitude: property.property_details?.longitude
        }

        return NextResponse.json({ success: true, data: transformedProperty })
    } catch (error) {
        console.error('Error in property API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 