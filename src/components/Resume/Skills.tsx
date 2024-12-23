import { useState, useMemo } from 'react';
import { Button, Card, Row, Col, Typography, Space, Progress, Tag, theme, Tooltip } from 'antd';
import { CheckCircleOutlined, StarFilled } from '@ant-design/icons';
import { skills, categories } from '../../data/resume/skills';
import type { Skill } from '../../types';

const { Text } = Typography;
const { useToken } = theme;

type CategoryState = Record<string, boolean>;

const Skills = (): JSX.Element => {
  const { token } = useToken();
  const initialCategories = useMemo(
    () => Object.fromEntries(categories.map((category) => [category, false])) as CategoryState,
    []
  );

  const [activeCategories, setActiveCategories] = useState<CategoryState>(initialCategories);

  const handleCategoryClick = (category: string): void => {
    setActiveCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const filteredSkills = useMemo(() => {
    const selectedCategories = Object.entries(activeCategories)
      .filter(([, isActive]) => isActive)
      .map(([category]) => category);

    return skills
      .filter(
        (skill) =>
          selectedCategories.length === 0 ||
          skill.category.some((cat) => selectedCategories.includes(cat))
      )
      .sort((a, b) => b.competency - a.competency);
  }, [activeCategories]);

  const getProgressColor = (competency: number): string => {
    if (competency >= 5) return token.colorSuccess;
    if (competency >= 4) return token.colorPrimary;
    return token.colorInfo;
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Card
        size="small"
        bordered={false}
        style={{
          background: token.colorBgTextHover,
          borderRadius: token.borderRadiusLG,
        }}
      >
        <Space wrap size={[8, 8]} style={{ width: '100%' }}>
          {categories.map((category) => (
            <Button
              key={category}
              type={activeCategories[category] ? 'primary' : 'default'}
              onClick={() => handleCategoryClick(category)}
              size="small"
              icon={activeCategories[category] ? <CheckCircleOutlined /> : undefined}
              style={{
                borderRadius: token.borderRadius,
                transition: 'all 0.3s',
              }}
            >
              {category}
            </Button>
          ))}
        </Space>
      </Card>

      <Row gutter={[16, 16]}>
        {filteredSkills.map((skill) => (
          <Col xs={24} sm={12} lg={8} key={skill.title}>
            <Card
              size="small"
              bordered
              style={{
                height: '100%',
                background: skill.competency >= 5 ? `${token.colorSuccessBg}` : undefined,
                borderRadius: token.borderRadiusLG,
                transition: 'all 0.3s',
              }}
            >
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <Space align="center" style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong style={{ fontSize: token.fontSizeLG }}>
                    {skill.title}
                  </Text>
                  <Space size={4} align="center">
                    {skill.competency >= 5 && (
                      <Tooltip title="Expert Level">
                        <StarFilled style={{ color: token.colorWarning }} />
                      </Tooltip>
                    )}
                    <Text type="secondary" style={{ fontSize: token.fontSize }}>
                      {skill.competency}/5
                    </Text>
                  </Space>
                </Space>

                <Progress
                  percent={skill.competency * 20}
                  showInfo={false}
                  strokeColor={getProgressColor(skill.competency)}
                  size="small"
                  style={{ margin: `${token.marginXXS}px 0` }}
                />

                <Space wrap size={[4, 4]} style={{ marginTop: token.marginXS }}>
                  {skill.category.map((cat) => (
                    <Tag
                      key={cat}
                      color={activeCategories[cat] ? 'blue' : 'default'}
                      style={{
                        margin: 0,
                        background: activeCategories[cat] ? undefined : token.colorBgTextHover,
                        borderRadius: token.borderRadiusSM,
                        transition: 'all 0.3s',
                      }}
                    >
                      {cat}
                    </Tag>
                  ))}
                </Space>
              </Space>
            </Card>
          </Col>
        ))}
      </Row>
    </Space>
  );
};

export default Skills;
