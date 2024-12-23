import type React from 'react';
import { Typography, Layout, Space, Grid, theme } from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import Personal from '../components/Stats/Personal';
import Site from '../components/Stats/Site';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Stats: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  return (
    <Content
      style={{
        padding: screens.sm ? token.paddingLG : token.padding,
        maxWidth: 1400,
        margin: '0 auto',
      }}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Space direction="vertical" size="small">
          <Title level={2}>
            <Space>
              <BarChartOutlined />
              Stats
            </Space>
          </Title>
          <Text type="secondary">Some interesting statistics about me and this website</Text>
        </Space>

        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Personal />
          <Site />
        </Space>
      </Space>
    </Content>
  );
};

export default Stats;
