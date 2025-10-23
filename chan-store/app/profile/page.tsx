import { cookies } from 'next/headers';
import { connectToDB } from '@/lib/db';
import { User } from '@/models/User';
import styles from './styles.module.css';
import { jwtVerify } from 'jose';

export const revalidate = 0;

export async function getCurrentUser() {
  await connectToDB();

  const cookieStore = cookies();
  const token = (await cookieStore).get('token')?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );

    const uid = (payload.sub as string) || (payload.id as string);
    if (!uid) return null;

    const user = await User.findById(uid).lean();
    return user ? JSON.parse(JSON.stringify(user)) : null;
  } catch (err) {
    console.error('Error verificando JWT:', err);
    return null;
  }
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  // Fallback mínimo si no hay sesión:
  const name = user?.name ?? 'Usuario';
  const email = user?.email ?? 'usuario@correo.com';
  const phone = user?.phone ?? '—';
  const address = user?.address ?? '—';
  const avatarUrl = user?.avatarUrl ?? '/avatar-placeholder.png';

  return (
    <div className={styles.page}>
      
        {/* Header con título y sin buscador */}
        {/* Nota: HomeChrome ya dibuja Header; si quieres este título, duplícalo como prop en HomeChrome */}
        <div className={styles.headerSpacer} />

        <section className={styles.wrap}>
          {/* Panel izquierdo con semicircunferencia */}
          <aside className={styles.left}>
            <div className={styles.avatarCircle}>
              <img src={avatarUrl} alt="Avatar" />
              <button className={styles.editPic} title="Cambiar foto">🖼️</button>
            </div>

            <div className={styles.userData}>
              <div className={styles.row}>
                <span className={styles.k}>Nombre</span>
                <span className={styles.v}>{name}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.k}>Correo</span>
                <span className={styles.v}>{email}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.k}>Celular</span>
                <span className={styles.v}>{phone}</span>
              </div>
              <div className={styles.row}>
                <span className={styles.k}>Dirección</span>
                <span className={styles.v}>{address}</span>
              </div>
            </div>
          </aside>

          {/* Panel derecho con botones */}
          <main className={styles.right}>
            <div className={styles.card}>
              <button className={styles.actionBtn}>Métodos de pago</button>
              <button className={styles.actionBtn}>Actualizar datos</button>
              <button className={styles.actionBtn}>Cambiar correo</button>
              <button className={styles.actionBtn}>Cambiar contraseña</button>
            </div>
          </main>
        </section>
      
    </div>
  );
}
