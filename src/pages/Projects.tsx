import type React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Layout, Row, Col, Space } from 'antd';
import Main from '../layouts/Main';
import Cell from '../components/Projects/Cell';
import data from '../data/projects';
import type { Project } from '../data/projects';

const { Title, Text } = Typography;
const { Content } = Layout;

const Projects: React.FC = () => (
  <Main>
    <Content>
      <Space direction="vertical" size="large" style={{ width: '100%', marginBottom: 24 }}>
        <Title level={2}>
          <Link to="/projects">Projects</Link>
        </Title>
        <Text>A selection of projects that I&apos;m not too ashamed of</Text>
      </Space>

      <Row gutter={[16, 16]}>
        {data.map((project: Project) => (
          <Col xs={24} sm={12} md={8} key={project.title}>
            <Cell data={project} />
          </Col>
        ))}
      </Row>
    </Content>
  </Main>
);

export default Projects;
