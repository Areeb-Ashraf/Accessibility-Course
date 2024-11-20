import React from 'react'
import { auth, signOut } from "@/auth";

export default async function Dashboard() {
    const session = await auth();
  return (
    <>
      Dashboard
      <h3 className="text-2xl font-semibold">
        User session data:
      </h3>
      {session ? (
        <div>
          <pre>
            {JSON.stringify(session, null, 2)}
          </pre>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: '/login' });
            }}
          >
           <button type='submit'> signOut</button>
          </form>
        </div>
      ) : (
        <div>Not signed in</div>
      )}
    </>
  )
}
