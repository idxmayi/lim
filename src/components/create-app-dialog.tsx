'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { createApp } from '@/lib/actions'

export function CreateAppDialog() {
  const [open, setOpen] = useState(false)
  const [reviews, setReviews] = useState<{ userName: string; rating: number; comment: string }[]>([])

  async function handleSubmit(formData: FormData) {
      const screenshotsRaw = formData.get('screenshots_input') as string
      if (screenshotsRaw) {
          const urls = screenshotsRaw.split(',').map(s => s.trim()).filter(s => s)
          formData.set('screenshots', JSON.stringify(urls))
      }
      const initial = reviews
        .map(r => ({
          userName: r.userName?.trim(),
          rating: Math.max(1, Math.min(5, Number(r.rating) || 0)),
          comment: r.comment?.trim()
        }))
        .filter(r => r.userName || r.comment)
      if (initial.length > 0) {
        formData.set('initial_reviews', JSON.stringify(initial))
      }
      
      await createApp(formData)
      setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create App</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New App</DialogTitle>
          <DialogDescription>
            Enter the details for your new PWA wrapper.
          </DialogDescription>
        </DialogHeader>
        <form action={handleSubmit} className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" name="name" placeholder="My App" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="target_url" className="text-right">Target URL</Label>
            <Input id="target_url" name="target_url" placeholder="https://example.com" className="col-span-3" required />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="logoUrl" className="text-right">Logo URL</Label>
            <Input id="logoUrl" name="logoUrl" placeholder="https://example.com/icon.png" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="themeColor" className="text-right">Theme Color</Label>
            <div className="col-span-3 flex gap-2">
                <Input id="themeColor" name="themeColor" type="color" className="w-12 p-1 h-10" defaultValue="#000000" />
                <Input name="themeColor_text" placeholder="#000000" className="flex-1" onChange={(e) => {
                    const el = document.getElementById('themeColor') as HTMLInputElement
                    if (el) el.value = e.target.value
                }} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">Description</Label>
            <Textarea id="description" name="description" placeholder="App description..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="apkUrl" className="text-right">Link Download APK</Label>
            <Input id="apkUrl" name="apkUrl" placeholder="https://drive.google.com/..." className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="screenshots_input" className="text-right">Screenshots</Label>
            <Textarea id="screenshots_input" name="screenshots_input" placeholder="Comma separated URLs: https://..., https://..." className="col-span-3" />
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Initial Reviews (Optional)</h3>
            {reviews.map((rev, idx) => (
              <div key={idx} className="grid gap-3 border rounded-md p-3">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">User Name</Label>
                  <Input
                    className="col-span-3"
                    value={rev.userName}
                    onChange={(e) => {
                      const next = [...reviews]
                      next[idx] = { ...next[idx], userName: e.target.value }
                      setReviews(next)
                    }}
                    placeholder="Nama pengguna"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Rating</Label>
                  <select
                    className="col-span-3 h-10 border rounded px-3"
                    value={rev.rating}
                    onChange={(e) => {
                      const next = [...reviews]
                      next[idx] = { ...next[idx], rating: Number(e.target.value) }
                      setReviews(next)
                    }}
                  >
                    <option value={5}>5</option>
                    <option value={4}>4</option>
                    <option value={3}>3</option>
                    <option value={2}>2</option>
                    <option value={1}>1</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Comment</Label>
                  <Textarea
                    className="col-span-3"
                    value={rev.comment}
                    onChange={(e) => {
                      const next = [...reviews]
                      next[idx] = { ...next[idx], comment: e.target.value }
                      setReviews(next)
                    }}
                    placeholder="Tulis komentar..."
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (reviews.length < 3) {
                    setReviews([...reviews, { userName: '', rating: 5, comment: '' }])
                  }
                }}
                disabled={reviews.length >= 3}
              >
                {reviews.length === 0 ? 'Add Review' : 'Add Another Review'}
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Create App</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
