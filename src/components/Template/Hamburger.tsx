import { type CSSProperties, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Menu, Button, Drawer, theme } from 'antd';
import type { MenuProps } from 'antd';
import {
  MenuOutlined,
  HomeOutlined,
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  BarChartOutlined,
  MailOutlined,
} from '@ant-design/icons';

const menuItems: MenuProps['items'] = [
  {
    key: '/',
    icon: <HomeOutlined />,
    label: 'Home',
  },
  {
    key: '/about',
    icon: <UserOutlined />,
    label: 'About',
  },
  {
    key: '/resume',
    icon: <FileTextOutlined />,
    label: 'Resume',
  },
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: 'Projects',
  },
  {
    key: '/stats',
    icon: <BarChartOutlined />,
    label: 'Stats',
  },
  {
    key: '/contact',
    icon: <MailOutlined />,
    label: 'Contact',
  },
];

const Navigation = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
    setOpen(false);
  };

  const styles = {
    mobileNav: {
      display: 'none',
      '@media (max-width: 768px)': {
        display: 'block',
        position: 'fixed' as const,
        top: 0,
        left: 0,
        right: 0,
        zIndex: token.zIndexBase + 1,
        backgroundColor: token.colorBgContainer,
        boxShadow: token.boxShadowTertiary,
        padding: token.paddingSM,
      },
    },
    desktopNav: {
      '@media (max-width: 768px)': {
        display: 'none',
      },
    },
  };

  return (
    <>
      {/* Mobile Navigation */}
      <div style={styles.mobileNav}>
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setOpen(true)}
          aria-label="Open navigation menu"
        />
      </div>

      {/* Desktop Navigation */}
      <nav style={styles.desktopNav as CSSProperties}>
        <Menu
          mode="horizontal"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
        />
      </nav>

      {/* Mobile Drawer */}
      <Drawer
        title="Navigation"
        placement="left"
        onClose={() => setOpen(false)}
        open={open}
        styles={{
          body: { padding: 0 },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={handleMenuClick}
          items={menuItems}
          style={{ border: 'none' }}
        />
      </Drawer>
    </>
  );
};

export default Navigation;
