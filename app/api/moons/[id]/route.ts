import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// DELETE: Hapus item
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  
  await prisma.moonCapture.delete({
    where: { id: id },
  });

  return NextResponse.json({ message: 'Deleted successfully' });
}

// PATCH: Edit item (Update sebagian)
export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = parseInt(params.id);
  const body = await request.json();

  const updatedMoon = await prisma.moonCapture.update({
    where: { id: id },
    data: {
      title: body.title,
      description: body.description,
    },
  });

  return NextResponse.json(updatedMoon);
}