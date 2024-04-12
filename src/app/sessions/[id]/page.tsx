'use client'

import { usePathname } from 'next/navigation'

function Session() {
  const pathname = usePathname();
  const id = pathname.split('/')[2];

  return (
    <div className="flex min-h-screen flex-col items-center justify-between p-24">We are now in a session with ID: {id}</div>
  )
}

export default Session;
