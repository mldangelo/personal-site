declare module 'react-burger-menu/lib/menus/slide' {
  import type { FC, ReactNode } from 'react';

  interface MenuProps {
    right?: boolean;
    isOpen?: boolean;
    children?: ReactNode;
  }

  const Menu: FC<MenuProps>;
  export default Menu;
}
