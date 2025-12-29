'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { sendNotification } from '@/lib/actions/notification'

type AppOpt = { id: string; name: string }

export function PushNotificationDialog({ apps }: { apps: AppOpt[] }) {
  const [open, setOpen] = useState(false)
  const [isSending, setIsSending] = useState(false)

  const [selectedApp, setSelectedApp] = useState<string>('ALL')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [icon, setIcon] = useState('')
  const [image, setImage] = useState('')

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (isSending) return
    setIsSending(true)
    try {
      const res = await sendNotification({
        appId: selectedApp,
        title,
        body,
        icon: icon || undefined,
        image: image || undefined,
      })
      if (res?.success) {
        alert(`Sent: ${res.successCount} success, ${res.failCount} fail`)
        setOpen(false)
      } else {
        alert('Failed to send notification')
      }
    } catch {
      alert('Failed to send notification')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">Push Notification</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Push Notification</DialogTitle>
          <DialogDescription>
            Kirim notifikasi ke salah satu aplikasi atau semua aplikasi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Select App</Label>
            <select className="col-span-3 h-10 border rounded px-3" value={selectedApp} onChange={(e) => setSelectedApp(e.target.value)}>
              <option value="ALL">All Apps</option>
              {apps.map(a => (
                <option key={a.id} value={a.id}>{a.name}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pn_title" className="text-right">Title</Label>
            <Input id="pn_title" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="Judul notifikasi" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pn_body" className="text-right">Body</Label>
            <Textarea id="pn_body" value={body} onChange={(e) => setBody(e.target.value)} required placeholder="Isi pesan..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pn_icon" className="text-right">Icon URL</Label>
            <Input id="pn_icon" value={icon} onChange={(e) => setIcon(e.target.value)} placeholder="https://example.com/icon.png" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="pn_image" className="text-right">Image URL</Label>
            <Input id="pn_image" value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://example.com/banner.png" className="col-span-3" />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Send'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
