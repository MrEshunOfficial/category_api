// app/api/regions/[region]/route.ts
import { NextResponse } from 'next/server';
import { getRegionByName } from '@/utils/regions';

export async function GET(
  request: Request,
  { params }: { params: { region: string } }
) {
  try {
    const regionData = getRegionByName(params.region);
    
    if (!regionData) {
      return new NextResponse(JSON.stringify({ error: 'Region not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new NextResponse(JSON.stringify({ data: regionData }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
    
  } catch (error) {
    console.error('Error fetching region:', error);
    return new NextResponse(JSON.stringify({ error: 'Error fetching region data' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}