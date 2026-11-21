import { SignIn } from '@clerk/nextjs'

// Sign-in on this app's own origin, for the same reason as /sign-up: the
// hosted Account Portal denies the camera to frames.
export default function Page() {
  return (
    <div className="flex justify-center p-8">
      <SignIn />
    </div>
  )
}
