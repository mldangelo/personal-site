import React from 'react';
import { Link } from 'react-router-dom';
import {
  BarChartOutlined,
  FileTextOutlined,
  GithubOutlined,
  MailOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Typography, theme, App, Layout, Space, Button, Menu, ConfigProvider, Flex } from 'antd';
import { motion } from 'framer-motion';
import type { AntdIconProps } from '@ant-design/icons/lib/components/AntdIcon';

import Main from '../layouts/Main';
import ErrorBoundaryWithHooks from '../components/ErrorBoundary';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { useToken } = theme;

// Create motion components
const MotionContent = motion(Content);
const MotionTitle = motion(Title);
const MotionFlex = motion(Flex);

interface MenuItem {
  key: string;
  icon: React.ReactElement;
  label: string;
  description: string;
}

// Navigation items
const menuItems: MenuItem[] = [
  {
    key: '/about',
    icon: <UserOutlined />,
    label: 'About',
    description: 'Learn about my background and experience',
  },
  {
    key: '/resume',
    icon: <FileTextOutlined />,
    label: 'Resume',
    description: 'View my professional experience',
  },
  {
    key: '/projects',
    icon: <ProjectOutlined />,
    label: 'Projects',
    description: 'Explore my work and contributions',
  },
  {
    key: '/stats',
    icon: <BarChartOutlined />,
    label: 'Stats',
    description: 'View metrics and achievements',
  },
];

// Hero Section
const HeroSection: React.FC = () => {
  const { token } = useToken();

  const titleVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: 'easeOut' },
    },
  };

  return (
    <MotionFlex
      vertical
      gap={token.sizeLG}
      initial="hidden"
      animate="visible"
      style={{ width: '100%' }}
    >
      <Space direction="vertical" size={token.sizeXS}>
        <MotionTitle
          variants={titleVariants}
          style={{
            fontSize: token.fontSizeHeading1,
            marginBottom: 0,
            letterSpacing: '-0.02em',
            background: `linear-gradient(90deg, ${token.colorText} 0%, ${token.colorPrimary} 100%)`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Hi, I&apos;m Michael.
        </MotionTitle>
        <MotionTitle
          variants={titleVariants}
          level={3}
          style={{
            marginTop: 0,
            marginBottom: 0,
            fontWeight: 'normal',
            fontSize: token.fontSizeHeading4,
            letterSpacing: '-0.01em',
            color: token.colorTextSecondary,
          }}
        >
          Co-founder & CTO at Promptfoo
        </MotionTitle>
      </Space>

      <Paragraph
        style={{
          fontSize: token.fontSizeLG,
          maxWidth: '55ch',
          lineHeight: 1.6,
          margin: 0,
          color: token.colorTextSecondary,
        }}
      >
        I&apos;m a Stanford ICME graduate and YC alumnus, building open-source tools to evaluate and
        secure LLMs. Previously VP of Engineering at SmileID, co-founder of Arthena and Matroid.
      </Paragraph>

      <Space size={token.size} style={{ marginTop: token.marginSM }}>
        <Button
          type="primary"
          icon={<MailOutlined />}
          size="large"
          style={{
            boxShadow: token.boxShadowSecondary,
          }}
        >
          <Link to="/contact">Get in Touch</Link>
        </Button>
        <Button icon={<GithubOutlined />} size="large">
          <a
            href="https://github.com/mldangelo/personal-site"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View source code on GitHub"
          >
            View Source
          </a>
        </Button>
      </Space>
    </MotionFlex>
  );
};

// Navigation Menu
const NavigationMenu: React.FC = () => {
  const { token } = useToken();

  const menuItemStyle = {
    height: 'auto',
    lineHeight: 1.5,
    padding: token.padding,
    borderRadius: token.borderRadiusLG,
    marginBottom: token.marginXS,
    transition: `all ${token.motionDurationMid}`,
  };

  const menuItemLabelStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: token.paddingXS,
  };

  const getMenuItem = (item: MenuItem): MenuProps['items'][number] => {
    const IconComponent = () => {
      const iconProps: AntdIconProps = {
        style: {
          fontSize: token.fontSizeLG,
          color: token.colorPrimary,
        },
      };
      return React.cloneElement(item.icon, iconProps);
    };

    return {
      key: item.key,
      icon: <IconComponent />,
      style: menuItemStyle,
      label: (
        <Link to={item.key}>
          <div style={menuItemLabelStyle}>
            <Text strong style={{ fontSize: token.fontSizeLG }}>
              {item.label}
            </Text>
            <Text type="secondary" style={{ fontSize: token.fontSize }}>
              {item.description}
            </Text>
          </div>
        </Link>
      ),
    };
  };

  return (
    <Menu
      mode="inline"
      style={{
        background: 'transparent',
        border: 'none',
      }}
      items={menuItems.map(getMenuItem)}
    />
  );
};

const Index: React.FC = () => {
  const { token } = useToken();

  return (
    <ErrorBoundaryWithHooks>
      <ConfigProvider
        theme={{
          components: {
            Button: {
              paddingInlineLG: 24,
              borderRadius: token.borderRadiusLG,
              primaryShadow: token.boxShadowSecondary,
              algorithm: true,
            },
            Menu: {
              itemHeight: 80,
              itemHoverBg: token.colorFillContent,
              itemSelectedBg: token.colorFillContent,
              itemSelectedColor: token.colorPrimary,
              horizontalItemSelectedBg: token.colorFillContent,
              darkItemSelectedBg: token.colorFillContent,
              itemBorderRadius: token.borderRadiusLG,
              itemMarginInline: 0,
              itemMarginBlock: token.marginXS,
            },
          },
        }}
      >
        <App>
          <Main>
            <MotionContent
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              style={{
                padding: `${token.paddingLG * 3}px ${token.paddingLG * 2}px`,
                maxWidth: 800,
                margin: '0 auto',
                background: 'transparent',
              }}
            >
              <Space direction="vertical" size={token.marginLG * 2} style={{ width: '100%' }}>
                <HeroSection />
                <NavigationMenu />
              </Space>
            </MotionContent>
          </Main>
        </App>
      </ConfigProvider>
    </ErrorBoundaryWithHooks>
  );
};

export default Index;
