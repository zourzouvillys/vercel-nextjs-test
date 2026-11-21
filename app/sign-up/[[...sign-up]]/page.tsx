import { SignUp } from '@clerk/nextjs'

// Sign-up on this app's own origin rather than the hosted Account Portal.
// The portal sends `Permissions-Policy: camera=()`, which denies the camera to
// every frame on the page, so a challenge that needs it (Protect's face
// liveness check) cannot run there.
export default function Page() {
  return (
    <div className="flex justify-center p-8">
      <SignUp />
    </div>
  )
}
