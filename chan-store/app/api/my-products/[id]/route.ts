import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { jwtVerify } from 'jose';
import { connectDB } from '@/lib/db';
import Product from '@/lib/models/Product';

async function getUserId() {
  const jar = await cookies();
  const token = jar.get('token')?.value;
  if (!token) return null;
  const secret = (process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '');
  if (!secret) return null;
  const { payload } = await jwtVerify(token, new TextEncoder().encode(secret));
  return (payload as any).id || (payload as any)._id || (payload as any).sub || null;
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const doc = await Product.findOne({ _id: params.id, userId }).lean();
    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(doc);
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const update: any = {
      name: String(body.name || '').trim(),
      description: String(body.description || ''),
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      images: Array.isArray(body.images) ? body.images : (body.image ? [String(body.image)] : []),
      category: typeof body.category === 'string' ? body.category : '',
    };

    // ✅ en PATCH sólo actualizamos isActive si viene explícito en el body
    if (typeof body.isActive === 'boolean') {
      update.isActive = body.isActive;
    }

    if (!update.name) {
      return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });
    }

    const doc = await Product.findOneAndUpdate(
      { _id: params.id, userId },
      { $set: update },
      { new: true }
    ).lean();

    if (!doc) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ ok: true, data: doc });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await Product.deleteOne({ _id: params.id, userId });
    return NextResponse.json({ ok: true });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
