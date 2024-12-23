import type React from 'react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Drawer } from 'antd';
import { MenuOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const routes = [
  {
    path: '/',
    label: 'About',
  },
  {
    path: '/resume',
    label: 'Resume',
  },
  {
    path: '/projects',
    label: 'Projects',
  },
  {
    path: '/stats',
    label: 'Stats',
  },
  {
    path: '/contact',
    label: 'Contact',
  },
];

const menuItems: MenuProps['items'] = routes.map((route) => ({
  key: route.path,
  label: <Link to={route.path}>{route.label}</Link>,
}));

const Navigation: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <Header style={{ display: 'flex', alignItems: 'center', padding: '0 24px' }}>
      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setOpen(true)}
        style={{ marginRight: 24 }}
      />
      <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
        Michael D&apos;Angelo
      </Link>
      <Drawer title="Navigation" placement="right" onClose={() => setOpen(false)} open={open}>
        <Menu mode="inline" selectedKeys={[location.pathname]} items={menuItems} />
      </Drawer>
    </Header>
  );
};

export default Navigation;
