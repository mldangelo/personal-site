import type React from 'react';
import { Typography, Layout, Card, Space, Grid, Divider } from 'antd';
import Main from '../layouts/Main';
import EmailLink from '../components/Contact/EmailLink';
import ContactIcons from '../components/Contact/ContactIcons';
import { theme } from 'antd';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Contact: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  return (
    <Main title="Contact" description="Contact Michael D'Angelo via email @ hi@mldangelo.com">
      <Content
        style={{
          padding: screens.sm ? token.paddingLG : token.padding,
          maxWidth: 1400,
          margin: '0 auto',
        }}
      >
        <Card
          bodyStyle={{
            padding: screens.lg ? token.paddingLG : token.padding,
          }}
          style={{
            borderRadius: token.borderRadiusLG,
          }}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            <Title level={2}>Contact</Title>

            <Space direction="vertical" size="middle" style={{ width: '100%' }}>
              <Space direction="vertical" size="small">
                <Text>Feel free to get in touch. You can email me at:</Text>
                <EmailLink />
              </Space>

              <Divider style={{ margin: `${token.marginLG}px 0` }} />

              <ContactIcons />
            </Space>
          </Space>
        </Card>
      </Content>
    </Main>
  );
};

export default Contact;
