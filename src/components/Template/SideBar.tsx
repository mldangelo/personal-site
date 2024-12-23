import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Layout,
  Menu,
  Avatar,
  Typography,
  Button,
  Drawer,
  theme,
  Switch,
  Space,
  Flex,
  Tooltip,
  Divider,
} from 'antd';
import type { CSSProperties } from 'react';
import {
  MenuOutlined,
  SunOutlined,
  MoonOutlined,
  SyncOutlined,
  UserOutlined,
  FileTextOutlined,
  ProjectOutlined,
  BarChartOutlined,
  MailOutlined,
  HomeOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { SIDEBAR_WIDTH } from '../../layouts/Main';
import { useThemeStore } from '../../stores/useThemeStore';

const { Sider } = Layout;
const { Title, Text } = Typography;

interface Route {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const routes: readonly Route[] = [
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

interface Styles {
  logo: CSSProperties;
  avatar: CSSProperties;
  title: CSSProperties;
  mobileHeader: CSSProperties;
  themeControls: CSSProperties;
  sider: CSSProperties;
  menu: CSSProperties;
}

const SideBar = ({ collapsed = false, onCollapse }: SideBarProps): JSX.Element => {
  const { token } = theme.useToken();
  const location = useLocation();
  const { isDarkMode, toggleTheme, setSystemPreference, systemPreference } = useThemeStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const styles = useMemo<Styles>(
    () => ({
      logo: {
        height: 64,
        padding: `${token.paddingSM}px ${token.paddingLG}px`,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : token.colorBgContainer,
        transition: `all ${token.motionDurationMid}`,
      },
      avatar: {
        marginRight: collapsed ? 0 : token.marginSM,
        border: `2px solid ${token.colorPrimary}`,
        backgroundColor: token.colorBgContainer,
        transition: `all ${token.motionDurationMid}`,
      },
      title: {
        margin: 0,
        color: token.colorTextHeading,
        opacity: collapsed ? 0 : 1,
        height: collapsed ? 0 : 'auto',
        overflow: 'hidden',
        transition: `all ${token.motionDurationMid}`,
        whiteSpace: 'nowrap',
      },
      mobileHeader: {
        display: 'none',
        [`@media (max-width: ${token.screenSM}px)`]: {
          display: 'flex',
          alignItems: 'center',
          padding: `0 ${token.padding}px`,
          height: 64,
          backgroundColor: isDarkMode ? token.colorBgContainer : token.colorBgBase,
          boxShadow: token.boxShadowTertiary,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: token.zIndexBase + 1,
        },
      } as CSSProperties,
      themeControls: {
        position: 'absolute' as const,
        bottom: 0,
        left: 0,
        right: 0,
        padding: token.paddingMD,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.04)' : token.colorBgContainer,
        textAlign: 'center' as const,
        transition: `all ${token.motionDurationMid}`,
      },
      sider: {
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        backgroundColor: isDarkMode ? token.colorBgContainer : token.colorBgBase,
        borderRight: `1px solid ${token.colorBorderSecondary}`,
        transition: `all ${token.motionDurationMid}`,
      },
      menu: {
        backgroundColor: 'transparent',
        borderRight: 'none',
        '& .ant-menu-item': {
          margin: '4px 8px',
          borderRadius: token.borderRadiusLG,
        },
        '& .ant-menu-item-selected': {
          backgroundColor: token.colorPrimary,
        },
      },
    }),
    [token, collapsed, isDarkMode]
  );

  const menuItems: MenuProps['items'] = routes.map((route) => ({
    key: route.path,
    icon: route.icon,
    label: <Link to={route.path}>{route.label}</Link>,
  }));

  const Logo = (): JSX.Element => (
    <Flex align="center" style={styles.logo}>
      <Avatar
        size={36}
        src="/images/me.jpg"
        style={styles.avatar}
        alt="Michael D'Angelo's profile picture"
      />
      <Title level={5} style={styles.title}>
        Michael D&apos;Angelo
      </Title>
    </Flex>
  );

  const ThemeControls = (): JSX.Element => (
    <Flex vertical gap="small" style={styles.themeControls}>
      <Divider style={{ margin: `${token.marginSM}px 0` }} />
      <Tooltip title="Toggle theme">
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
          style={{ width: '100%' }}
        >
          {!collapsed && 'Theme'}
        </Button>
      </Tooltip>
      {!collapsed && (
        <Space size="small" align="center" style={{ justifyContent: 'center', width: '100%' }}>
          <Switch
            size="small"
            checked={systemPreference}
            onChange={setSystemPreference}
            checkedChildren={<SyncOutlined />}
            unCheckedChildren={<SyncOutlined />}
            aria-label="Use system theme preference"
          />
          <Text type="secondary" style={{ fontSize: token.fontSizeSM }}>
            System
          </Text>
        </Space>
      )}
    </Flex>
  );

  return (
    <>
      {/* Desktop Sider */}
      <Sider
        theme={isDarkMode ? 'dark' : 'light'}
        width={SIDEBAR_WIDTH.lg}
        collapsible
        collapsed={collapsed}
        onCollapse={onCollapse}
        breakpoint="lg"
        style={styles.sider}
      >
        <Logo />
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme={isDarkMode ? 'dark' : 'light'}
          style={styles.menu}
        />
        <ThemeControls />
      </Sider>

      {/* Mobile Header */}
      <div style={styles.mobileHeader} role="banner">
        <Button
          type="text"
          icon={<MenuOutlined />}
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation menu"
        />
        <Title level={5} style={{ margin: `0 ${token.margin}px` }}>
          Michael D&apos;Angelo
        </Title>
        <Button
          type="text"
          icon={isDarkMode ? <SunOutlined /> : <MoonOutlined />}
          onClick={toggleTheme}
          style={{ marginLeft: 'auto' }}
          aria-label={`Switch to ${isDarkMode ? 'light' : 'dark'} mode`}
        />
      </div>

      {/* Mobile Drawer */}
      <Drawer
        title={<Logo />}
        placement="left"
        onClose={() => setMobileOpen(false)}
        open={mobileOpen}
        bodyStyle={{ padding: 0 }}
        width={SIDEBAR_WIDTH.lg}
        styles={{
          header: { padding: 0, border: 'none' },
          body: { backgroundColor: isDarkMode ? token.colorBgContainer : token.colorBgBase },
          mask: { backdropFilter: 'blur(4px)' },
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          theme={isDarkMode ? 'dark' : 'light'}
          style={styles.menu}
        />
        <ThemeControls />
      </Drawer>
    </>
  );
};

export default SideBar;
