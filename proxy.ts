import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse, type NextRequest } from 'next/server'

const isProxyRoute = createRouteMatcher(['/__clerk/(.*)'])

const isProtectedRoute = createRouteMatcher(['/dashboard/(.*)'])

const PROXY_PREFIX = '/__clerk'

const frontendApiHostname = () =>
    process.env.CLERK_FRONTEND_API_HOSTNAME ?? 'frontend-api.clerk.dev'

// fetch() hands back a decoded body but leaves the upstream's encoding headers
// intact, so forwarding these verbatim would leave the client trying to gunzip
// plaintext. Length goes for the same reason: it describes the encoded body.
const STRIPPED_RESPONSE_HEADERS = [
    'content-encoding',
    'content-length',
    'transfer-encoding',
    'connection',
]

/**
 * Points a Location header back at this app rather than the Frontend API, so the
 * browser stays on our origin for the next hop. Redirects to anywhere else — an
 * OAuth provider, say — are left alone.
 */
function rewriteLocation(location: string, req: NextRequest): string {
    let target: URL
    try {
        target = new URL(location, `https://${frontendApiHostname()}`)
    } catch {
        return location
    }

    if (target.hostname !== frontendApiHostname()) {
        return location
    }

    const self = new URL(req.url)
    target.protocol = self.protocol
    target.host = self.host
    target.pathname = `${PROXY_PREFIX}${target.pathname}`
    return target.toString()
}

async function proxyToFrontendApi(req: NextRequest) {
    const target = new URL(req.url)
    target.protocol = 'https:'
    target.hostname = frontendApiHostname()
    target.port = ''
    target.pathname = target.pathname.slice(PROXY_PREFIX.length)

    const headers = new Headers(req.headers)
    headers.set('Clerk-Proxy-Url', process.env.NEXT_PUBLIC_CLERK_PROXY_URL || '')
    headers.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
    headers.set('X-Forwarded-For', '1.2.3.5')
    // Host names this app, not the Frontend API. Dropping accept-encoding asks for
    // an identity response, which keeps the body consistent with the headers we send back.
    headers.delete('host')
    headers.delete('accept-encoding')

    console.log('Proxying request to Clerk frontend API:', target.host)

    const hasBody = req.method !== 'GET' && req.method !== 'HEAD'
    const upstream = await fetch(target, {
        method: req.method,
        headers,
        body: hasBody ? req.body : undefined,
        // Rewritten below rather than followed, so the browser keeps talking to this origin.
        redirect: 'manual',
        // Required whenever the body is a stream.
        duplex: 'half',
    } as RequestInit & { duplex: 'half' })

    const responseHeaders = new Headers()
    upstream.headers.forEach((value, key) => {
        if (!STRIPPED_RESPONSE_HEADERS.includes(key.toLowerCase())) {
            responseHeaders.set(key, value)
        }
    })

    // forEach folds repeated Set-Cookie headers into one comma-joined value, which
    // corrupts them. getSetCookie keeps them separate.
    responseHeaders.delete('set-cookie')
    for (const cookie of upstream.headers.getSetCookie()) {
        responseHeaders.append('set-cookie', cookie)
    }

    const location = upstream.headers.get('location')
    if (location) {
        responseHeaders.set('location', rewriteLocation(location, req))
    }

    return new NextResponse(upstream.body, {
        status: upstream.status,
        statusText: upstream.statusText,
        headers: responseHeaders,
    })
}

export default clerkMiddleware(async (auth, req) => {
    console.log('Middleware invoked for:', req.url)
    if (isProxyRoute(req)) {
        return proxyToFrontendApi(req)
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
