import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export async function middleware(request: NextRequest) {
  const host = request.headers.get('host') || ''
  const hostname = host.split(':')[0].toLowerCase()
  const platformHosts = ['localhost', '127.0.0.1']
  if (platformHosts.includes(hostname) || hostname.endsWith('.vercel.app')) {
    return NextResponse.next()
  }
  const resolveUrl = new URL(`/api/domain/resolve?host=${hostname}`, request.url)
  try {
    const res = await fetch(resolveUrl.toString(), { headers: { 'x-mw': '1' } })
    if (res.ok) {
      const data = await res.json()
      const rewriteUrl = new URL(`/view/${data.appId}`, request.url)
      return NextResponse.rewrite(rewriteUrl)
    }
  } catch {}
  return NextResponse.next()
}
