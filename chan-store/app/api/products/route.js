import { NextResponse } from 'next/server';
import { connectDB } from '../../../lib/mongodb.js';      // <-- ojo con la ruta
import Product from '../../../models/Product.js';

export const runtime = 'nodejs'; // Necesario para usar Node (no Edge)

export async function GET(req) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const q = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '-createdAt'; // e.g. price,-price,name

  const filter = { };
  if (q) filter.name = { $regex: q, $options: 'i' };
  if (category) filter.category = category;

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Product.find(filter).sort(sort.split(',').join(' ')).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter)
  ]);

  return NextResponse.json({
    data: items,
    page,
    limit,
    total,
    pages: Math.ceil(total / limit)
  });
}

export async function POST(req) {
  try {
    await connectDB();
    const body = await req.json();

    // Validación mínima
    if (!body?.name || typeof body.name !== 'string') {
      return NextResponse.json({ error: 'name es requerido' }, { status: 400 });
    }
    if (typeof body.price !== 'number') {
      return NextResponse.json({ error: 'price numérico es requerido' }, { status: 400 });
    }

    const doc = await Product.create({
      name: body.name.trim(),
      price: body.price,
      description: body.description || '',
      images: Array.isArray(body.images) ? body.images : [],
      stock: typeof body.stock === 'number' ? body.stock : 0,
      category: body.category || '',
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true
    });

    return NextResponse.json(doc, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error creando producto' }, { status: 500 });
  }
}

