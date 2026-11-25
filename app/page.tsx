import { Show } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'

export default async function Home() {
  const user = await currentUser()
  const name = user?.firstName ?? user?.primaryEmailAddress?.emailAddress

  return (
    <main className="flex flex-col items-center gap-4 p-16">
      <h1 className="text-4xl font-semibold">Hello, {name ?? 'world'}!</h1>
      <Show when="signed-out">
        <p>Sign in or sign up to continue.</p>
      </Show>
      <Show when="signed-in">
        <p>You are signed in.</p>
      </Show>
    </main>
  )
}
