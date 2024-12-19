// app/api/regions/route.ts
import { NextResponse } from 'next/server';
import { getAllRegions } from '@/utils/regions';
import type { Region } from '@/types/regions';

// Handle OPTIONS request for CORS
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

export async function GET() {
  try {
    const regions = getAllRegions();
    
    if (!regions || regions.length === 0) {
      return new NextResponse(JSON.stringify({ 
        error: 'No regions data available',
        message: 'Please ensure the _data directory exists in the src folder with JSON files'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }
    
    return new NextResponse(JSON.stringify({ data: regions }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('Error fetching regions:', error);
    return new NextResponse(JSON.stringify({ 
      error: 'Error fetching regions data',
      message: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
}