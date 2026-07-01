import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone()

  // Protect /admin in production using Cloudflare Access headers if enabled
  if (process.env.NODE_ENV === 'production' && url.pathname.startsWith('/admin')) {
    const cfJwt = request.headers.get('cf-access-jwt-assertion')
    const host = request.headers.get('host') || ''

    if (process.env.CLOUDFLARE_ZERO_TRUST_ENABLED === 'true') {
      // 1. Prevent Vercel deployment URL bypasses by redirecting to the custom domain
      if (host.includes('.vercel.app')) {
        const customDomain = process.env.NEXT_PUBLIC_CUSTOM_DOMAIN || 'https://narva.in'
        return NextResponse.redirect(`${customDomain}${url.pathname}${url.search}`)
      }
      // 2. Reject requests that did not pass through Cloudflare Access
      if (!cfJwt) {
        return new NextResponse(
          'Unauthorized: Admin panel is protected by Cloudflare Zero Trust.',
          { status: 401 }
        );
      }
    }
  }

  // 3. Subdomain routing: Rewrite shop.narva.in (and shop.localhost) root to /products catalog internally
  const host = request.headers.get('host') || ''
  if (host.startsWith('shop.narva.in') || host.startsWith('shop.localhost')) {
    if (url.pathname === '/') {
      url.pathname = '/products'
      return NextResponse.rewrite(url)
    }
  }

  return await updateSession(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
