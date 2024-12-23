import {
  BarChartOutlined,
  FileTextOutlined,
  GithubOutlined,
  MailOutlined,
  ProjectOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Card, Col, Grid, Row, Space, Typography, theme } from 'antd';
import { motion } from 'framer-motion';
import type React from 'react';
import { Link } from 'react-router-dom';
import Main from '../layouts/Main';

const { Title, Text, Paragraph } = Typography;
const { useBreakpoint } = Grid;

const MotionCard = motion(Card);

const Index: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const sections = [
    {
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      title: 'About Me',
      description: 'Learn about my journey in ML, engineering leadership, and entrepreneurship.',
      link: '/about',
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      title: 'Resume',
      description:
        'View my experience as CTO at Promptfoo and former VP of Engineering at SmileID.',
      link: '/resume',
    },
    {
      icon: <ProjectOutlined style={{ fontSize: 24 }} />,
      title: 'Projects',
      description: 'Explore my work in LLM evaluation, African fintech, and more.',
      link: '/projects',
    },
    {
      icon: <BarChartOutlined style={{ fontSize: 24 }} />,
      title: 'Stats',
      description: 'Numbers that tell the story of my work and impact.',
      link: '/stats',
    },
  ];

  return (
    <Main title="Home">
      <div style={{ padding: screens.sm ? token.paddingLG : token.padding }}>
        <Space
          direction="vertical"
          size="large"
          style={{ width: '100%', maxWidth: 1200, margin: '0 auto' }}
        >
          {/* Hero Section */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ borderRadius: token.borderRadiusLG }}
            bodyStyle={{ padding: token.paddingLG }}
          >
            <Space direction="vertical" size="large">
              <Title level={1} style={{ marginBottom: 0 }}>
                Michael D'Angelo
              </Title>
              <Title level={3} type="secondary" style={{ marginTop: 0, fontWeight: 'normal' }}>
                Co-founder & CTO at Promptfoo
              </Title>
              <Paragraph style={{ fontSize: token.fontSizeLG }}>
                Building open-source tools to evaluate and secure LLMs. Previously VP of Engineering
                at SmileID, helping over 170 million people in Africa access financial services.
              </Paragraph>
              <Space wrap>
                <Button type="primary" icon={<MailOutlined />} size="large">
                  <Link to="/contact">Get in Touch</Link>
                </Button>
                <Button icon={<GithubOutlined />} size="large">
                  <a
                    href="https://github.com/mldangelo/personal-site"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Source
                  </a>
                </Button>
              </Space>
            </Space>
          </MotionCard>

          {/* Navigation Cards */}
          <Row gutter={[16, 16]}>
            {sections.map((section, index) => (
              <Col xs={24} sm={12} key={section.title}>
                <MotionCard
                  hoverable
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                >
                  <Link to={section.link}>
                    <Space direction="vertical" size="middle">
                      {section.icon}
                      <Title level={4} style={{ marginBottom: token.marginXS }}>
                        {section.title}
                      </Title>
                      <Text type="secondary">{section.description}</Text>
                    </Space>
                  </Link>
                </MotionCard>
              </Col>
            ))}
          </Row>
        </Space>
      </div>
    </Main>
  );
};

export default Index;
