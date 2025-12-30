import { getApp } from '@/lib/actions'
import { updateAppSettings } from '@/lib/actions/app'
import { notFound, redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function AppSettingsPage({ params, searchParams }: { params: { id: string }, searchParams: { [key: string]: string | string[] | undefined } }) {
  const app = await getApp(params.id)
  if (!app) {
    notFound()
  }

  async function handleSave(formData: FormData) {
    'use server'
    const domain = (formData.get('custom_domain') as string)?.trim() || ''
    const apk = (formData.get('apk_url') as string)?.trim() || ''
    await updateAppSettings(app!.id, { customDomain: domain || null, apkUrl: apk || null })
    redirect(`/dashboard/app/${app!.id}/settings?saved=1`)
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <h1 className="text-3xl font-bold">App Settings</h1>
        {searchParams?.saved === '1' && (
          <div className="mt-3 text-sm text-green-600">Berhasil disimpan</div>
        )}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Konfigurasi</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSave} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="custom_domain">Custom Domain</Label>
              <Input id="custom_domain" name="custom_domain" placeholder="domain-anda.com" defaultValue={app.customDomain || ''} />
              <p className="text-xs text-slate-500">
                Masukkan domain Anda tanpa http://. Pastikan DNS CNAME sudah diarahkan ke server kami.
              </p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="apk_url">APK Download Link</Label>
              <Input id="apk_url" name="apk_url" placeholder="https://drive.google.com/..." defaultValue={app.apkUrl || ''} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
