# Clerk hello world

A Next.js app for testing Clerk, deployed at https://staging.zrz.io. Sign-in (`/sign-in`),
sign-up (`/sign-up`) and the profile (`/user-profile`) are pages in this app, and the
Frontend API is proxied through `/__clerk`.

```bash
npm install
npm run dev
```

Environment: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`,
`NEXT_PUBLIC_CLERK_PROXY_URL` (`https://staging.zrz.io/__clerk`), and optionally
`CLERK_FRONTEND_API_HOSTNAME` to override the proxy's upstream.

The proxy deliberately reports the client IP as `1.2.3.5`.
