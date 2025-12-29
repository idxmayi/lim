'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { deleteApp } from '@/lib/actions/app'

export function DeleteAppButton({ appId, children }: { appId: string, children?: React.ReactNode }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  return (
    <Button
      variant="destructive"
      disabled={loading}
      onClick={async () => {
        if (loading) return
        const ok = confirm('Are you sure?')
        if (!ok) return
        setLoading(true)
        try {
          await deleteApp(appId)
          router.refresh()
        } finally {
          setLoading(false)
        }
      }}
    >
      {loading ? 'Deleting...' : children || 'Delete'}
    </Button>
  )
}
