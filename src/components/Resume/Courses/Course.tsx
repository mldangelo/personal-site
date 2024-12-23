import { Card, Typography, Space } from 'antd';
import type { Course as CourseType } from '../../../types';

const { Text, Link } = Typography;

interface CourseProps {
  data: CourseType;
}

const Course = ({ data }: CourseProps): JSX.Element => {
  const { title, number, link } = data;

  return (
    <Card
      size="small"
      hoverable
      bodyStyle={{
        padding: 12,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Space direction="vertical" size={4}>
        <Link href={link} target="_blank" rel="noopener noreferrer" strong>
          {title}
        </Link>
        <Text type="secondary" style={{ fontSize: '0.9em' }}>
          {number}
        </Text>
      </Space>
    </Card>
  );
};

export default Course;
