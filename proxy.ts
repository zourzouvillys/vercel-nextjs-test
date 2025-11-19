import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

const isProxyRoute = createRouteMatcher(['/__clerk/(.*)'])

const isProtectedRoute = createRouteMatcher(['/dashboard/(.*)'])

export default clerkMiddleware(async (auth, req) => {
    console.log('Middleware invoked for:', req.url)
    if (isProxyRoute(req)) {
        const proxyHeaders = new Headers(req.headers)
        proxyHeaders.set('Clerk-Proxy-Url', process.env.NEXT_PUBLIC_CLERK_PROXY_URL || '')
        proxyHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
        proxyHeaders.set('X-Forwarded-For','1.2.3.5')
        const proxyUrl = new URL(req.url)
        proxyUrl.host = process.env.CLERK_FRONTEND_API_HOSTNAME ?? 'frontend-api.clerk.dev'
        proxyUrl.port = '443'
        proxyUrl.protocol = 'https'
        proxyUrl.pathname = proxyUrl.pathname.replace('/__clerk', '')
        console.log('Proxying request to Clerk frontend API:', proxyUrl.host)
        return NextResponse.rewrite(proxyUrl, {
            request: {
                headers: proxyHeaders,
            },
        })
    }
    if (isProtectedRoute(req)) {
        await auth.protect()
    }
    return null
})



 
export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
    '/__clerk',
    '/__clerk/(.*)',
  ],
}
