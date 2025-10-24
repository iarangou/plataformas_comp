// app/api/store/profile/route.ts
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';

import { connectDB } from '@/lib/db';
import Store from '@/lib/models/Store';

// Reutilizamos el mismo tipo mínimo
type StoreLean = {
  _id?: string;
  userId?: string;
  name?: string;
  description?: string;
  image?: string;
};

async function getUserIdFromCookies() {
  const jar = await cookies();
  const token = jar.get('token')?.value;
  if (!token) return null;

  const secretStr =
    process.env.JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    '';
  if (!secretStr) return null;

  try {
    const secret = new TextEncoder().encode(secretStr);
    const { payload } = await jwtVerify(token, secret);
    return (
      (payload as any).id || (payload as any)._id || (payload as any).sub || null
    );
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    await connectDB();
    const userId = await getUserIdFromCookies();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 👇 tipamos el lean para el objeto que devolvemos
    const store = await Store.findOne({ userId }).lean<StoreLean>();
    return NextResponse.json({ store: store || null });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserIdFromCookies();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const name: string = (body.name || '').trim();
    const description: string = (body.description || '').trim();

    if (name.length < 2 || name.length > 60) {
      return NextResponse.json(
        { error: 'El nombre debe tener entre 2 y 60 caracteres' },
        { status: 400 }
      );
    }

    await Store.findOneAndUpdate(
      { userId },
      { $set: { name, description } },
      { upsert: true, new: true }
    );

    // para la respuesta leemos el doc ya actualizado, tipado
    const updated = await Store.findOne({ userId }).lean<StoreLean>();

    return NextResponse.json({ ok: true, store: updated });
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message || 'Server error' },
      { status: 500 }
    );
  }
}
