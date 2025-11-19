'use client'

import { SignIn, useUser } from '@clerk/nextjs'

export default function Home() {
  const { isSignedIn } = useUser()

  if (!isSignedIn) {
    return <SignIn />
  }

  return <div>Welcome!</div>
}