import type React from 'react';
import { Card, Typography, Space } from 'antd';
import type { Project } from '../../data/projects';

const { Title, Paragraph, Text } = Typography;

interface CellProps {
  data: Project;
}

const Cell: React.FC<CellProps> = ({ data }) => (
  <Card
    hoverable
    cover={
      <div
        style={{
          height: 200,
          overflow: 'hidden',
          background: `url(${data.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
    }
    onClick={() => data.link && window.open(data.link, '_blank', 'noopener,noreferrer')}
  >
    <Card.Meta
      title={
        <>
          <Title level={4}>{data.title}</Title>
          <Text type="secondary">{data.subtitle}</Text>
        </>
      }
      description={
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <Text type="secondary">{data.date}</Text>
          <Paragraph ellipsis={{ rows: 3 }}>{data.desc}</Paragraph>
        </Space>
      }
    />
  </Card>
);

export default Cell;
