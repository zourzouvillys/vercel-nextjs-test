import { UserProfile } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import { USER_PROFILE_URL } from '@/lib/auth-routes'

export default async function Page() {
  await auth.protect()

  return (
    <main className="flex justify-center p-8">
      <UserProfile routing="path" path={USER_PROFILE_URL} />
    </main>
  )
}
