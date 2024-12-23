import { Link } from 'react-router-dom';
import {
  Typography,
  Space,
  Layout,
  Anchor,
  Card,
  Row,
  Col,
  Affix,
  theme,
  Divider,
  Grid,
} from 'antd';
import { GithubOutlined, LinkedinOutlined } from '@ant-design/icons';

import Education from '../components/Resume/Education';
import Experience from '../components/Resume/Experience';
import Skills from '../components/Resume/Skills';
import Courses from '../components/Resume/Courses';
import References from '../components/Resume/References';

import courses from '../data/resume/courses';
import degrees from '../data/resume/degrees';
import work from '../data/resume/work';
import { skills, categories } from '../data/resume/skills';
import type { Skill } from '../types';

const { Title, Text } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

interface SectionProps {
  data?: unknown;
  skills?: Skill[];
  categories?: string[];
}

type SectionComponent = React.FC<SectionProps>;

const sections = {
  Experience: ({ data }: SectionProps) => <Experience data={data as typeof work} />,
  Skills: ({ skills: skillsData, categories: categoriesData }: SectionProps) => (
    <Skills skills={skillsData as Skill[]} categories={categoriesData as string[]} />
  ),
  Education: ({ data }: SectionProps) => <Education data={data as typeof degrees} />,
  Courses: ({ data }: SectionProps) => <Courses data={data as typeof courses} />,
  References: () => <References />,
} satisfies Record<string, SectionComponent>;

const sectionData: Record<string, Partial<SectionProps>> = {
  Experience: { data: work },
  Skills: { skills, categories },
  Education: { data: degrees },
  Courses: { data: courses },
  References: {},
};

const Resume = () => {
  const { token } = theme.useToken();
  const screens = useBreakpoint();

  const items = Object.keys(sections).map((section) => ({
    key: section.toLowerCase(),
    href: `#${section.toLowerCase()}`,
    title: section,
  }));

  const sidebarWidth = screens.lg ? 5 : 24;
  const contentWidth = screens.lg ? 19 : 24;

  return (
    <Content style={{ padding: token.paddingLG, maxWidth: 1400, margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={sidebarWidth}>
          <Affix offsetTop={24}>
            <Card
              size="small"
              bodyStyle={{
                padding: token.padding,
                display: 'flex',
                flexDirection: 'column',
                gap: token.paddingXS,
              }}
              style={{
                borderRadius: token.borderRadiusLG,
              }}
            >
              <Space direction="vertical" size={1}>
                <Title level={4} style={{ marginBottom: 0 }}>
                  Michael D&apos;Angelo
                </Title>
                <Text type="secondary">Co-founder & CTO at Promptfoo</Text>
              </Space>
              <Space
                split={<Divider type="vertical" />}
                wrap
                style={{ justifyContent: 'center' }}
              >
                <Link to="https://github.com/mldangelo" target="_blank" rel="noopener noreferrer">
                  <Space size="small">
                    <GithubOutlined />
                    <Text>GitHub</Text>
                  </Space>
                </Link>
                <Link
                  to="https://www.linkedin.com/in/mldangelo"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Space size="small">
                    <LinkedinOutlined />
                    <Text>LinkedIn</Text>
                  </Space>
                </Link>
              </Space>
              {screens.lg && (
                <>
                  <Divider style={{ margin: `${token.marginXS}px 0` }} />
                  <Anchor
                    items={items}
                    targetOffset={token.marginLG}
                    style={{ marginTop: 0 }}
                    affix={false}
                  />
                </>
              )}
            </Card>
          </Affix>
        </Col>
        <Col xs={24} lg={contentWidth}>
          <Card
            bodyStyle={{
              padding: screens.lg ? token.paddingLG : token.padding,
            }}
            style={{
              borderRadius: token.borderRadiusLG,
            }}
          >
            {Object.entries(sections).map(([name, Section], index, array) => (
              <div
                key={name}
                id={name.toLowerCase()}
                style={{
                  scrollMarginTop: token.marginLG,
                  marginBottom: index === array.length - 1 ? 0 : token.marginLG * 2,
                }}
              >
                <Title level={3}>{name}</Title>
                <Section {...sectionData[name]} />
                {index !== array.length - 1 && (
                  <Divider style={{ margin: `${token.marginLG * 2}px 0 0` }} />
                )}
              </div>
            ))}
          </Card>
        </Col>
      </Row>
    </Content>
  );
};

export default Resume;
