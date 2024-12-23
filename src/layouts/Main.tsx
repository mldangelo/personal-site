import { type ReactNode, useMemo, Suspense, useState } from 'react';
import { Layout, theme, Spin, ConfigProvider, App } from 'antd';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SideBar from '../components/Template/SideBar';
import type { CSSProperties } from 'react';
import ErrorBoundaryWithHooks from '../components/ErrorBoundary';

const { Content, Footer } = Layout;
const { useToken } = theme;

// Constants for responsive breakpoints with better type safety
export const SIDEBAR_WIDTH = {
  sm: 0, // Mobile: no sidebar
  md: 200, // Tablet: smaller sidebar
  lg: 256, // Desktop: full sidebar (Ant Design's default)
} as const;

export type SidebarWidth = (typeof SIDEBAR_WIDTH)[keyof typeof SIDEBAR_WIDTH];

export const MOBILE_HEADER_HEIGHT = 64; // Ant Design's default header height
export const COLLAPSED_WIDTH = 80; // Ant Design's default collapsed width

// Loading Component with improved accessibility
const LoadingSpinner: React.FC<{ style?: CSSProperties }> = ({ style }) => (
  <div
    style={{
      ...style,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: 280,
    }}
    role="progressbar"
    aria-label="Loading content"
  >
    <Spin size="large" />
  </div>
);

interface MainProps {
  children: ReactNode;
}

const Main: React.FC<MainProps> = ({ children }) => {
  const { token } = useToken();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  // Memoize styles to prevent unnecessary recalculations
  const styles = useMemo(
    () => ({
      layout: {
        minHeight: '100vh',
        backgroundColor: token.colorBgLayout,
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
      } as CSSProperties,
      contentLayout: {
        marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.lg,
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'transparent',
        position: 'relative',
        transition: `margin ${token.motionDurationMid} ${token.motionEaseInOut}`,
        width: `calc(100% - ${collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.lg}px)`,
        [`@media (max-width: ${token.screenMD}px)`]: {
          marginLeft: collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.md,
          width: `calc(100% - ${collapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH.md}px)`,
        },
        [`@media (max-width: ${token.screenSM}px)`]: {
          marginLeft: 0,
          marginTop: MOBILE_HEADER_HEIGHT,
          width: '100%',
        },
      } as CSSProperties,
      mainContent: {
        flex: 1,
        margin: token.marginLG,
        padding: token.paddingLG,
        backgroundColor: token.colorBgContainer,
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
        position: 'relative',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
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
      } as CSSProperties,
      contentWrapper: {
        position: 'relative',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: '100vh',
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      } as CSSProperties,
      footer: {
        textAlign: 'center',
        backgroundColor: 'transparent',
        margin: `${token.marginSM}px ${token.marginLG}px`,
        color: token.colorTextSecondary,
        transition: `all ${token.motionDurationMid} ${token.motionEaseInOut}`,
      } as CSSProperties,
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
        ease: [0.4, 0, 0.2, 1], // Material Design easing
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  return (
    <App>
      <ConfigProvider
        theme={{
          components: {
            Layout: {
              bodyBg: 'transparent',
              headerBg: token.colorBgContainer,
              footerBg: 'transparent',
              siderBg: token.colorBgContainer,
              motionDurationMid: '0.3s',
              motionDurationSlow: '0.4s',
            },
            Menu: {
              activeBarBorderWidth: 0,
              itemBg: 'transparent',
              itemSelectedBg: token.colorFillContent,
              itemHoverBg: token.colorFillContent,
              itemHoverColor: token.colorPrimary,
              itemSelectedColor: token.colorPrimary,
              itemHeight: 48,
              itemMarginInline: token.marginXS,
              itemPaddingInline: token.paddingLG,
              itemBorderRadius: token.borderRadiusLG,
              iconSize: token.fontSizeLG,
              iconMarginInlineEnd: token.marginSM,
              motionDurationMid: '0.3s',
              motionDurationSlow: '0.4s',
            },
          },
        }}
      >
        <Layout style={styles.layout} hasSider>
          <SideBar collapsed={collapsed} onCollapse={setCollapsed} />
          <Layout style={styles.contentLayout}>
            <ErrorBoundaryWithHooks>
              <div style={styles.contentWrapper}>
                <Content style={styles.mainContent} role="main">
                  <Suspense fallback={<LoadingSpinner />}>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.div
                        key={location.pathname}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        variants={pageVariants}
                        style={{ width: '100%', height: '100%' }}
                      >
                        {children}
                      </motion.div>
                    </AnimatePresence>
                  </Suspense>
                </Content>
                <Footer style={styles.footer}>
                  ©{new Date().getFullYear()} Michael D&apos;Angelo. All rights reserved.
                </Footer>
              </div>
            </ErrorBoundaryWithHooks>
          </Layout>
        </Layout>
      </ConfigProvider>
    </App>
  );
};

export default Main;
