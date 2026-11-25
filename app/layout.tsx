import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ClerkProvider, Show, UserButton } from '@clerk/nextjs'
import { HOME_URL, SIGN_IN_URL, SIGN_UP_URL, USER_PROFILE_URL } from '@/lib/auth-routes'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hello World',
  description: 'Clerk sign-in and sign-up test app',
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ClerkProvider
          signInUrl={SIGN_IN_URL}
          signUpUrl={SIGN_UP_URL}
          signInFallbackRedirectUrl={HOME_URL}
          signUpFallbackRedirectUrl={HOME_URL}
          afterSignOutUrl={HOME_URL}
          afterMultiSessionSingleSignOutUrl={HOME_URL}
        >
          <header className="flex h-16 items-center justify-between p-4">
            <Link href={HOME_URL}>Hello World</Link>
            <nav className="flex items-center gap-4">
              <Suspense>
                <Show when="signed-out">
                  <Link href={SIGN_IN_URL}>Sign in</Link>
                  <Link href={SIGN_UP_URL} className="rounded-full bg-[#6c47ff] px-4 py-2 text-white">
                    Sign up
                  </Link>
                </Show>
                <Show when="signed-in">
                  <UserButton userProfileMode="navigation" userProfileUrl={USER_PROFILE_URL} />
                </Show>
              </Suspense>
            </nav>
          </header>
          {children}
        </ClerkProvider>
      </body>
    </html>
  )
}
