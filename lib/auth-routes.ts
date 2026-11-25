// Every auth destination is a path on this origin. Both ClerkProvider (client)
// and clerkMiddleware (server) need these: either one, left unset, falls back to
// the instance's Account Portal (accounts.staging.zrz.io). Besides leaving this
// site, the portal denies the camera to frames, which breaks Protect liveness checks.
export const SIGN_IN_URL = '/sign-in'
export const SIGN_UP_URL = '/sign-up'
export const USER_PROFILE_URL = '/user-profile'
export const HOME_URL = '/'
