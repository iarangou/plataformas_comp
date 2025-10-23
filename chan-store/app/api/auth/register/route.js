import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '../../../../lib/mongodb.js';
import User from '../../../../models/User.js';

export const runtime = 'nodejs';

export async function POST(req) {
  try {

    await connectDB();
    const { name, email, password, confirmPassword } = await req.json();
    const _name = String(name || '').trim();

    // Validaciones básicas
    if (!name || !email || !password || !confirmPassword)
      return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 });

    if (_name.length < 2 || _name.length > 60) {
      return NextResponse.json({ error: 'El nombre debe tener entre 2 y 60 caracteres' },{ status: 400 });}
    
    if (password !== confirmPassword)
      return NextResponse.json({ error: 'Las contraseñas no coinciden' }, { status: 400 });

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: 'El correo ya está registrado' }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: _name,
      email,
      passwordHash: hash
    });

    return NextResponse.json({ ok: true, message: 'Usuario creado', id: user._id });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Error en el registro' }, { status: 500 });
  }
}
 
