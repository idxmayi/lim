import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const url = new URL(request.url)
  const host = url.searchParams.get('host') || ''
  const hostname = host.split(':')[0].toLowerCase()
  if (!hostname) {
    return new NextResponse('Bad Request', { status: 400 })
  }
  const app = await prisma.app.findUnique({ where: { customDomain: hostname } })
  if (!app) {
    return new NextResponse('Not Found', { status: 404 })
  }
  return NextResponse.json({ appId: app.id })
}
