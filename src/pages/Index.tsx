import React from 'react';
import { Link } from 'react-router-dom';
import { GithubOutlined, MailOutlined } from '@ant-design/icons';
import { Typography, theme, Layout, Space, Button, Flex } from 'antd';
import { motion } from 'framer-motion';
import ErrorBoundaryWithHooks from '../components/ErrorBoundary';

const { Title, Text, Paragraph } = Typography;
const { Content } = Layout;
const { useToken } = theme;

// Create motion components
const MotionContent = motion(Content);
const MotionTitle = motion(Title);
const MotionFlex = motion(Flex);

const Index: React.FC = () => {
  const { token } = useToken();

  return (
    <ErrorBoundaryWithHooks>
      <MotionContent
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        style={{
          padding: `${token.paddingLG * 2}px`,
          maxWidth: 800,
          margin: '0 auto',
          background: 'transparent',
        }}
      >
        <MotionFlex
          vertical
          gap={token.sizeLG}
          initial="hidden"
          animate="visible"
          style={{ width: '100%' }}
        >
          <Space direction="vertical" size={token.sizeXS}>
            <MotionTitle
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
      </MotionContent>
    </ErrorBoundaryWithHooks>
  );
};

export default Index;
