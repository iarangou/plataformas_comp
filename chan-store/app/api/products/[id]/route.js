 
import { NextResponse } from 'next/server';
import { connectDB } from '../../../../lib/mongodb.js';
import Product from '../../../../models/Product.js';
import mongoose from 'mongoose';

export const runtime = 'nodejs';

export async function GET(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }

  const doc = await Product.findById(id).lean();
  if (!doc) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }

  const updates = await req.json();
  // Saneamos algunos campos
  if (updates?.name && typeof updates.name === 'string') updates.name = updates.name.trim();

  const doc = await Product.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true
  }).lean();

  if (!doc) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });
  return NextResponse.json(doc);
}

export async function DELETE(_req, { params }) {
  await connectDB();
  const { id } = params;
  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'id inválido' }, { status: 400 });
  }

  const result = await Product.findByIdAndDelete(id).lean();
  if (!result) return NextResponse.json({ error: 'No encontrado' }, { status: 404 });

  return NextResponse.json({ ok: true });
}
