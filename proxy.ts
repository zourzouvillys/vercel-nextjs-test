import { clerkFrontendApiProxy, clerkMiddleware } from '@clerk/nextjs/server'
import type { NextFetchEvent, NextRequest } from 'next/server'
import { SIGN_IN_URL, SIGN_UP_URL } from '@/lib/auth-routes'

const PROXY_PATH = '/__clerk'

const withClerk = clerkMiddleware({ signInUrl: SIGN_IN_URL, signUpUrl: SIGN_UP_URL })

// Clerk's helper, rather than clerkMiddleware's `frontendApiProxy` option, because
// this test app overrides both the upstream hostname and the client IP. The helper
// also rewrites Frontend API redirects back under /__clerk, on this origin.
function proxyFrontendApi(req: NextRequest) {
  const headers = new Headers(req.headers)
  // Deliberate: Clerk sees this fixed test IP. The helper prefers these two
  // headers over X-Forwarded-For, so they have to go.
  headers.delete('cf-connecting-ip')
  headers.delete('x-real-ip')
  headers.set('X-Forwarded-For', '1.2.3.5')

  const hostname = process.env.CLERK_FRONTEND_API_HOSTNAME

  return clerkFrontendApiProxy(new Request(req, { headers }), {
    proxyPath: PROXY_PATH,
    publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.CLERK_SECRET_KEY,
    fapiUrl: hostname ? `https://${hostname}` : undefined,
  })
}

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const { pathname } = req.nextUrl
  if (pathname === PROXY_PATH || pathname.startsWith(`${PROXY_PATH}/`)) {
    return proxyFrontendApi(req)
  }
  return withClerk(req, event)
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
    // Always run for the Clerk Frontend API proxy
    '/__clerk',
    '/__clerk/(.*)',
  ],
}
