import type React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Layout, Space, Button } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;

const NotFound: React.FC = () => (
  <Content>
    <Space
      direction="vertical"
      size="large"
      align="center"
      style={{ width: '100%', marginTop: 48 }}
    >
      <Title>Page Not Found</Title>
      <Text>The requested page could not be found.</Text>
      <Button type="primary">
        <Link to="/">Return to Home</Link>
      </Button>
    </Space>
  </Content>
);

export default NotFound;
