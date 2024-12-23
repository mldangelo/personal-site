import type React from 'react';
import { Typography, Card, Row, Col, Statistic, theme, Grid, Tooltip, Space } from 'antd';
import {
  EnvironmentOutlined,
  GlobalOutlined,
  ClockCircleOutlined,
  TranslationOutlined,
  CoffeeOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import data from '../../data/stats/personal';

const { Title } = Typography;
const { useBreakpoint } = Grid;

const MotionCard = motion(Card);

const Personal: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const iconStyle = {
    fontSize: token.fontSizeLG,
  };

  const stats = [
    {
      key: 'location',
      title: 'Current Location',
      value: data.find((item) => item.key === 'location')?.value,
      icon: <EnvironmentOutlined style={iconStyle} />,
      tooltip: 'Where I currently live and work',
    },
    {
      key: 'countries',
      title: 'Countries Visited',
      value: data.find((item) => item.key === 'countries')?.value,
      icon: <GlobalOutlined style={iconStyle} />,
      tooltip: 'Number of countries I have visited',
      suffix: 'countries',
    },
    {
      key: 'age',
      title: 'Current Age',
      value: data.find((item) => item.key === 'age')?.value,
      icon: <ClockCircleOutlined style={iconStyle} />,
      tooltip: 'My current age',
      suffix: 'years',
    },
    {
      key: 'languages',
      title: 'Languages',
      value: data.find((item) => item.key === 'languages')?.value,
      icon: <TranslationOutlined style={iconStyle} />,
      tooltip: 'Languages I can communicate in',
    },
    {
      key: 'drinks',
      title: 'Beverages',
      value: data.find((item) => item.key === 'drinks')?.value,
      icon: <CoffeeOutlined style={iconStyle} />,
      tooltip: 'Number of beverages consumed',
      suffix: 'drinks',
    },
  ];

  return (
    <Card
      bodyStyle={{
        padding: screens.lg ? token.paddingLG : token.padding,
      }}
      style={{
        borderRadius: token.borderRadiusLG,
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={3} style={{ marginBottom: token.marginLG }}>
            Personal Stats
          </Title>
        </motion.div>

        <Row gutter={[24, 24]}>
          {stats.map((stat, index) => (
            <Col key={stat.key} xs={24} sm={12} lg={8}>
              <Tooltip title={stat.tooltip}>
                <MotionCard
                  size="small"
                  bordered={false}
                  style={{ background: token.colorFillQuaternary }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                  }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }}
                >
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    suffix={stat.suffix}
                    valueStyle={{
                      fontSize: token.fontSizeLG,
                      color: token.colorText,
                    }}
                  />
                </MotionCard>
              </Tooltip>
            </Col>
          ))}
        </Row>
      </Space>
    </Card>
  );
};

export default Personal;
