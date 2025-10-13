import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

const MIN_PASSWORD_LENGTH = 8;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,}$/;

export async function POST(request: Request): Promise<Response> {
  try {
    const { name, username, email, password } = await request.json();

    if (!name || !username || !email || !password) {
      return NextResponse.json({ error: 'Faltan datos para crear la cuenta.' }, { status: 400 });
    }

    if (!USERNAME_REGEX.test(username)) {
      return NextResponse.json(
        { error: 'El usuario debe tener al menos 3 caracteres y solo puede incluir letras, números, punto, guion o guion bajo.' },
        { status: 400 }
      );
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.` },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).toLowerCase();
    const normalizedUsername = String(username).toLowerCase();

    const existing = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { username: normalizedUsername }]
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'El email o usuario ya están registrados.' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    await prisma.user.create({
      data: {
        name: String(name).trim(),
        username: normalizedUsername,
        email: normalizedEmail,
        password: hashedPassword
      }
    });

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Error registrando usuario:', error);
    return NextResponse.json(
      { error: 'Ocurrió un error creando la cuenta. Intenta nuevamente.' },
      { status: 500 }
    );
  }
}
