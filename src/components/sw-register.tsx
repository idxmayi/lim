'use client'

import { useEffect, useState, useCallback } from 'react'
import { subscribeUser } from '@/lib/actions'

export default function SWRegister() {
  const [showBanner, setShowBanner] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)
  type NavigatorStandalone = Navigator & { standalone?: boolean }

  function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4)
    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  const ensureSubscription = useCallback(async () => {
    try {
      if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
      const match = typeof window !== 'undefined' ? window.location.pathname.match(/^\/view\/([^/]+)/) : null
      const appId = match?.[1]
      if (!appId) return

      const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      const registration = await navigator.serviceWorker.ready
      let subscription = await registration.pushManager.getSubscription()
      if (!subscription && vapidKey) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey)
        })
      }
      if (subscription) {
        await subscribeUser(appId, JSON.parse(JSON.stringify(subscription)))
      }
    } catch (e) {
      console.error('Subscription update failed', e)
    }
  }, [])

  useEffect(() => {
    async function init() {
      console.log('Notification system initialized')
      const navigatorStandalone = window.navigator as NavigatorStandalone
      const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || !!navigatorStandalone.standalone
      setIsStandalone(!!standalone)
      if ('serviceWorker' in navigator) {
        try {
          await navigator.serviceWorker.register('/sw.js')
        } catch (e) {
          console.error('Service Worker registration failed', e)
        }
      }
      const current = Notification.permission
      setShowBanner(current === 'default' && !standalone)
      if (current === 'granted') {
        await ensureSubscription()
      }
    }
    init()
  }, [ensureSubscription])

  async function onActivate() {
    try {
      const result = await Notification.requestPermission()
      const navigatorStandalone = window.navigator as NavigatorStandalone
      const standalone = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches) || !!navigatorStandalone.standalone
      setShowBanner(result === 'default' && !standalone)
      if (result === 'granted') {
        await ensureSubscription()
      }
    } catch (e) {
      console.error('Permission request failed', e)
    }
  }

  if (!showBanner || isStandalone) return null

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="rounded-lg shadow-lg border border-slate-200 bg-white p-4 flex items-center gap-3">
        <div className="text-sm">
          Aktifkan Notifikasi untuk Update Terbaru
        </div>
        <button
          onClick={onActivate}
          className="px-3 py-1.5 rounded-md bg-black text-white text-sm"
        >
          Aktifkan
        </button>
      </div>
    </div>
  )
}
