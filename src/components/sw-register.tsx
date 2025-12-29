'use client'

import { useEffect } from 'react'

export default function SWRegister() {
  useEffect(() => {
    async function registerSW() {
      if ('serviceWorker' in navigator) {
        try {
          const reg = await navigator.serviceWorker.register('/sw.js')
          console.log('Service Worker registered', reg)
        } catch (e) {
          console.error('Service Worker registration failed', e)
        }
      }
    }
    registerSW()
  }, [])
  return null
}
