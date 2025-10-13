import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
 
  try {
    // Get the token from the request
    const token = await getToken({ 
      req: request, 
      secret: process.env.NEXTAUTH_SECRET!
    })
    
    
    // If no token, redirect to home page
    if (!token) {
      console.log('❌ No authentication token, redirecting to home')
      return NextResponse.redirect(new URL('/', request.url))
    }
    
    return NextResponse.next()
    
  } catch (error) {
    console.error('💥 Auth Middleware error:', error)
    // Redirect to home on error
    return NextResponse.redirect(new URL('/', request.url))
  }
}

export const config = {
  matcher: ["/shop", "/shop/:path*" , "/cart" , "/cart/:path*",  "/newsletter", "/newsletter/:path*"],
}