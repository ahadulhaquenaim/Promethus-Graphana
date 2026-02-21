import { NextResponse } from 'next/server';
import { routeHits } from './src/app/api/metrics.js';

// This function will run for all requests
export function middleware(request) {
  // Extract route information
  const { pathname } = request.nextUrl;
  const method = request.method;
  
  try {
    // Normalize the route (replace dynamic segments)
    const normalizedRoute = normalizeRoute(pathname);
    
    // Increment the counter
    routeHits.inc({ route: normalizedRoute, method });
  } catch (error) {
    // Don't let metrics errors affect the actual request
    console.error('Error tracking metrics:', error);
  }
  
  const response = NextResponse.next();
  return response;
}

function normalizeRoute(pathname) {
  // Normalize dynamic routes to avoid creating too many unique metrics
  
  // Replace UUIDs and MongoDB ObjectIds with [id]
  let normalized = pathname.replace(/\/[0-9a-f]{24}\b/gi, '/[id]'); // MongoDB ObjectId
  normalized = normalized.replace(/\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '/[id]'); // UUID
  normalized = normalized.replace(/\/\d+/g, '/[id]'); // numeric IDs
  
  return normalized;
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
