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

export async function GET(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(Number(searchParams.get('limit') || 50), 100);
    const page  = Math.max(Number(searchParams.get('page') || 1), 1);

    const [data, total] = await Promise.all([
      Product.find({ userId })
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Product.countDocuments({ userId }),
    ]);

    const pages = Math.ceil(total / limit);
    return NextResponse.json({ data, page, limit, total, pages });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const name = String(body.name || '').trim();
    if (!name) return NextResponse.json({ error: 'El nombre es obligatorio' }, { status: 400 });

    const doc = await Product.create({
      userId,
      name,
      description: String(body.description || ''),
      price: Number(body.price || 0),
      stock: Number(body.stock || 0),
      images: Array.isArray(body.images) ? body.images : (body.image ? [String(body.image)] : []),
      category: typeof body.category === 'string' ? body.category : '',
      // ✅ default a true sólo en POST
      isActive: (typeof body.isActive === 'boolean') ? body.isActive : true,
    });

    return NextResponse.json({ ok: true, data: { ...doc.toObject(), _id: String(doc._id) } });
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'Server error' }, { status: 500 });
  }
}
