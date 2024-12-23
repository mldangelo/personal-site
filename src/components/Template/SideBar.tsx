import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Layout, Menu, Avatar, Typography, Button, Drawer } from 'antd';
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  BarChartOutlined,
  MailOutlined,
  HomeOutlined,
  GithubOutlined,
} from '@ant-design/icons';
import { useThemeStore } from '../../stores/useThemeStore';
import { SIDEBAR_WIDTH } from '../../layouts/Main';
import './sidebar.css';

const { Sider } = Layout;
const { Text } = Typography;

const routes = [
  { path: '/', label: 'Home', icon: <HomeOutlined /> },
  { path: '/about', label: 'About', icon: <UserOutlined /> },
  { path: '/resume', label: 'Resume', icon: <FileTextOutlined /> },
  { path: '/projects', label: 'Projects', icon: <ProjectOutlined /> },
  { path: '/stats', label: 'Stats', icon: <BarChartOutlined /> },
  { path: '/contact', label: 'Contact', icon: <MailOutlined /> },
] as const;

interface SideBarProps {
  collapsed?: boolean;
  onCollapse?: (collapsed: boolean) => void;
}

const SideBar: React.FC<SideBarProps> = ({ collapsed = false, onCollapse }) => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useThemeStore();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const menuItems = routes.map((route) => ({
    key: route.path,
    icon: route.icon,
    label: <Link to={route.path}>{route.label}</Link>,
  }));

  const sidebarContent = (
    <>
      <div className="sidebar-logo">
        <Avatar size={40} src="/images/me.jpg" className="avatar" />
        {!collapsed && (
          <div className="logo-text">
            <Text strong className="name">
              Michael D&apos;Angelo
            </Text>
            <Link
              to="https://github.com/mldangelo"
              target="_blank"
              className="github-link"
              rel="noopener noreferrer"
            >
              <GithubOutlined /> mldangelo
            </Link>
          </div>
        )}
      </div>

      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        theme={isDarkMode ? 'dark' : 'light'}
      />

      <div className="theme-controls">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          className="theme-button"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        />
      </div>
    </>
  );

  return (
    <>
      <Sider
        theme={isDarkMode ? 'dark' : 'light'}
        width={SIDEBAR_WIDTH.lg}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        trigger={null}
        className="main-sidebar"
      >
        {sidebarContent}
      </Sider>

      <Button
        type="text"
        icon={<MenuOutlined />}
        onClick={() => setMobileOpen(true)}
        className="mobile-menu-button"
      />

      <Drawer
        title="Menu"
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        width={SIDEBAR_WIDTH.lg}
        styles={{
          body: { padding: 0 },
          header: { display: 'none' },
        }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default SideBar;
