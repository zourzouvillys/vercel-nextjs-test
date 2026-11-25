import { Suspense } from 'react'
import { SignIn } from '@clerk/nextjs'
import { SIGN_IN_URL, SIGN_UP_URL } from '@/lib/auth-routes'

export default function Page() {
  return (
    <main className="flex justify-center p-8">
      <Suspense>
        <SignIn routing="path" path={SIGN_IN_URL} signUpUrl={SIGN_UP_URL} />
      </Suspense>
    </main>
  )
}
