import React, { useMemo, Suspense, useState } from 'react';
import { Layout, theme, Spin, Result, Button, ConfigProvider } from 'antd';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from '../components/Template/SideBar';
import type { CSSProperties } from 'react';
import { useThemeStore } from '../stores/useThemeStore';

const { Content, Header, Footer } = Layout;

// Define types for our styles with better type safety
type ResponsiveStyle = CSSProperties & {
  [key: `@media (max-width: ${number}px)`]: CSSProperties;
};

type StyleMap = {
  layout: CSSProperties;
  contentLayout: ResponsiveStyle;
  mainContent: ResponsiveStyle;
  loadingContainer: CSSProperties;
  footer: CSSProperties;
};

interface MainProps {
  children: React.ReactNode;
}

// Constants for responsive breakpoints with better type safety
export const SIDEBAR_WIDTH = {
  sm: 0, // Mobile: no sidebar
  md: 200, // Tablet: smaller sidebar
  lg: 256, // Desktop: full sidebar (Ant Design's default)
} as const;

export type SidebarWidth = (typeof SIDEBAR_WIDTH)[keyof typeof SIDEBAR_WIDTH];

const MOBILE_HEADER_HEIGHT = 64; // Ant Design's default header height
const COLLAPSED_WIDTH = 80; // Ant Design's default collapsed width

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="error"
          title="Something went wrong"
          subTitle={this.state.error?.message}
          extra={[
            <Button type="primary" key="reload" onClick={() => window.location.reload()}>
              Reload Page
            </Button>,
          ]}
        />
      );
    }

    return this.props.children;
  }
}

// Loading Component
const LoadingSpinner: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <div style={{ ...style, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    <Spin size="large" />
  </div>
);

const Main = ({ children }: MainProps): JSX.Element => {
  const { token } = theme.useToken();
  const { isDarkMode } = useThemeStore();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Memoize styles to prevent unnecessary recalculations
  const styles = useMemo<StyleMap>(
    () => ({
      layout: {
        minHeight: '100vh',
      },
      contentLayout: {
        marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.lg,
        transition: `all ${token.motionDurationMid}`,
        backgroundColor: token.colorBgLayout,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        [`@media (max-width: ${token.screenMD}px)`]: {
          marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.md,
        },
        [`@media (max-width: ${token.screenSM}px)`]: {
          marginLeft: 0,
          marginTop: MOBILE_HEADER_HEIGHT,
        },
      },
      mainContent: {
        flex: 1,
        margin: token.marginLG,
        padding: token.paddingLG,
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
        transition: `all ${token.motionDurationMid}`,
        [`@media (max-width: ${token.screenSM}px)`]: {
          margin: token.marginSM,
          padding: token.paddingSM,
          borderRadius: token.borderRadius,
        },
        '@media print': {
          margin: 0,
          padding: 0,
          boxShadow: 'none',
        },
      },
      loadingContainer: {
        height: '100%',
        minHeight: 280,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      },
      footer: {
        textAlign: 'center',
        backgroundColor: 'transparent',
        margin: `${token.marginSM}px ${token.marginLG}px`,
      },
    }),
    [token, collapsed]
  );

  // Page transition variants
  const pageVariants = {
    initial: {
      opacity: 0,
      y: 20,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: 'easeOut',
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: 'easeIn',
      },
    },
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: token.colorBgLayout,
            headerBg: token.colorBgContainer,
            footerBg: 'transparent',
          },
        },
      }}
    >
      <Layout style={styles.layout} hasSider>
        <SideBar collapsed={collapsed} onCollapse={setCollapsed} />
        <Layout style={styles.contentLayout}>
          <ErrorBoundary>
            <Content style={styles.mainContent}>
              <Suspense fallback={<LoadingSpinner style={styles.loadingContainer} />}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={location.pathname}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={pageVariants}
                  >
                    {children}
                  </motion.div>
                </AnimatePresence>
              </Suspense>
            </Content>
            <Footer style={styles.footer}>
              ©{new Date().getFullYear()} Michael D&apos;Angelo. All rights reserved.
            </Footer>
          </ErrorBoundary>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};

export default Main;
