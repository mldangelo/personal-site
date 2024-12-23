import { Timeline, Card, Typography, Space, Tag, Button } from 'antd';
import type { Position } from '../../types';
import dayjs from 'dayjs';

const { Title, Paragraph, Text, Link } = Typography;

interface ExperienceProps {
  data: Position[];
}

const Experience = ({ data = [] }: ExperienceProps): JSX.Element => {
  const formatDate = (date: string) => dayjs(date).format('MMM YYYY');

  return (
    <Timeline
      mode="left"
      items={data.map((job) => ({
        color: 'blue',
        label: (
          <Space direction="vertical" size={0}>
            <Text>{formatDate(job.startDate)}</Text>
            {job.endDate && <Text>{formatDate(job.endDate)}</Text>}
          </Space>
        ),
        children: (
          <Card size="small" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="small" style={{ width: '100%' }}>
              <Space direction="vertical" size={0}>
                <Title level={4} style={{ marginBottom: 0 }}>
                  {job.position}
                </Title>
                <Space size="small" wrap>
                  <Link href={job.url} target="_blank">
                    {job.name}
                  </Link>
                  {job.endDate === undefined && <Tag color="blue">Current</Tag>}
                </Space>
              </Space>
              <Paragraph>{job.summary}</Paragraph>
              {job.highlights && (
                <ul style={{ margin: 0, paddingLeft: 16 }}>
                  {job.highlights.map((highlight) => (
                    <li key={highlight}>
                      <Text>{highlight}</Text>
                    </li>
                  ))}
                </ul>
              )}
            </Space>
          </Card>
        ),
      }))}
    />
  );
};

export default Experience;
