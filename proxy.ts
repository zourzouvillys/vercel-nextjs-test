import { NextResponse, NextRequest } from 'next/server'
 
export function proxy(req: NextRequest) {

    const proxyHeaders = new Headers(req.headers)
    proxyHeaders.set('Clerk-Proxy-Url', process.env.NEXT_PUBLIC_CLERK_PROXY_URL || '')
    proxyHeaders.set('Clerk-Secret-Key', process.env.CLERK_SECRET_KEY || '')
    proxyHeaders.set('X-Forwarded-For', '1.2.3.5')

    const proxyUrl = new URL(req.url)
    proxyUrl.host = 'frontend-api.clerk.dev'
    proxyUrl.port = '443'
    proxyUrl.protocol = 'https'
    proxyUrl.pathname = proxyUrl.pathname.replace('/__clerk', '')

    return NextResponse.rewrite(proxyUrl, {
      request: {
        headers: proxyHeaders,
      },
    })


}
 
export const config = {
  matcher: [
    '/__proxy/*'
],
}

