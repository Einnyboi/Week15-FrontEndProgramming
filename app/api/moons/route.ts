import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // Import dari file yang kita buat di langkah 3

// GET: Ambil semua data
export async function GET() {
  const moons = await prisma.moonCapture.findMany({
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json(moons);
}

// POST: Tambah data baru
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const newMoon = await prisma.moonCapture.create({
      data: {
        title: body.title,
        description: body.description,
        imageUrl: body.imageUrl || null,
      },
    });
    
    return NextResponse.json(newMoon, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Gagal menyimpan' }, { status: 500 });
  }
}