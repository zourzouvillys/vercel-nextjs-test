import { Suspense } from 'react'
import { SignUp } from '@clerk/nextjs'
import { SIGN_IN_URL, SIGN_UP_URL } from '@/lib/auth-routes'

export default function Page() {
  return (
    <main className="flex justify-center p-8">
      <Suspense>
        <SignUp routing="path" path={SIGN_UP_URL} signInUrl={SIGN_IN_URL} />
      </Suspense>
    </main>
  )
}
