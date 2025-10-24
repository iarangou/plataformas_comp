'use client';

import Image from 'next/image';
import styles from '@/app/home/sidebar.module.css';
import { useRouter } from 'next/navigation';

type Item = {
  key: string;
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
};

export default function LeftSidebar({
  open,
  onClose,
  onNavigate,
  userName = 'User',
  userAvatar = '/avatar-placeholder.png', // pon una imagen en public o deja este placeholder
}: {
  open: boolean;
  onClose: () => void;
  onNavigate?: (key: string) => void;
  userName?: string;
  userAvatar?: string;
}) {

  const router = useRouter();  
  const items: Item[] = [
    { key: 'home',      label: 'Inicio',    icon: <span className={styles.iHome} /> },
    { key: 'profile',   label: 'Perfil',    icon: <span className={styles.iUser} /> },
    { key: 'orders',    label: 'Pedidos',   icon: <span className={styles.iCart} /> },
    { key: 'store',     label: 'Mi tienda', icon: <span className={styles.iStore} /> },
    { key: 'help',      label: 'Ayuda',     icon: <span className={styles.iHelp} /> },
    { key: 'favs',      label: 'Favoritos', icon: <span className={styles.iHeart} /> },
  ];

  const routes: Record<string, string> = {
  home: '/home',
  profile: '/profile',
  orders: '/questState',
  store: '/store',
  help: '/help',
  favs: '/favorites',
};

const handle = (key: string) => {
  onNavigate?.(key);
  if (routes[key]) router.push(routes[key]);
  onClose();
};


  const handleLogout = () => {
    onClose();
    router.replace('/login'); // usa push si prefieres permitir volver con "Atrás"
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayShow : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      {/* Drawer */}
      <aside
        className={`${styles.drawer} ${open ? styles.drawerOpen : ''}`}
        aria-hidden={!open}
        aria-label="Menú lateral"
      >
        {/* Header azul con avatar */}
        <div className={styles.top}>
          <div className={styles.avatarWrap}>
            <Image src={userAvatar} alt="Avatar" width={56} height={56} className={styles.avatar} />
          </div>
          <div className={styles.userName}>{userName}</div>
        </div>

        {/* Lista */}
        <nav className={styles.list}>
          {items.map((it) => (
            <button key={it.key} className={styles.item} onClick={() => handle(it.key)}>
              <span className={styles.left}>
                {it.icon}
                <span className={styles.label}>{it.label}</span>
              </span>
              <span className={styles.chev} aria-hidden>›</span>
            </button>
          ))}
          <hr className={styles.sep} />
        </nav>

        {/* Footer con cerdito + cerrar sesión */}
        <div className={styles.footer}>
          <Image src="/cart-icon.svg" alt="Logo" width={84} height={84} className={styles.footerLogo} />
          <button className={styles.logout} onClick={handleLogout}>
            Cerrar sesión
          </button>
        </div>
      </aside>
    </>
  );
}
