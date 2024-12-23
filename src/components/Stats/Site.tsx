import type React from 'react';
import { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Statistic, theme, Grid, Tooltip, Space, Skeleton } from 'antd';
import {
  CodeOutlined,
  GithubOutlined,
  ClockCircleOutlined,
  StarOutlined,
  EyeOutlined,
  ForkOutlined,
  IssuesCloseOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

interface GitHubStats {
  stargazers_count: number;
  subscribers_count: number;
  forks_count: number;
  open_issues_count: number;
  updated_at: string;
  size: number;
}

const Site: React.FC = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();
  const [stats, setStats] = useState<GitHubStats>({
    stargazers_count: 0,
    subscribers_count: 0,
    forks_count: 0,
    open_issues_count: 0,
    updated_at: new Date().toISOString(),
    size: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGitHubStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://api.github.com/repos/mldangelo/personal-site');
        if (!response.ok) {
          throw new Error(`GitHub API returned ${response.status}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch GitHub stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch stats');
      } finally {
        setLoading(false);
      }
    };

    fetchGitHubStats();
  }, []);

  const iconStyle = {
    fontSize: token.fontSizeLG,
  };

  const siteStats = [
    {
      title: 'Last Updated',
      value: dayjs(stats.updated_at).fromNow(),
      icon: <ClockCircleOutlined style={iconStyle} />,
      tooltip: 'When the site was last updated',
    },
    {
      title: 'Repository Size',
      value: stats.size,
      icon: <CodeOutlined style={iconStyle} />,
      suffix: 'KB',
      tooltip: 'Size of the codebase',
    },
    {
      title: 'GitHub Stars',
      value: stats.stargazers_count,
      icon: <StarOutlined style={iconStyle} />,
      tooltip: 'Number of GitHub stars',
      link: 'https://github.com/mldangelo/personal-site/stargazers',
    },
    {
      title: 'Watchers',
      value: stats.subscribers_count,
      icon: <EyeOutlined style={iconStyle} />,
      tooltip: 'Number of people watching this repository',
      link: 'https://github.com/mldangelo/personal-site/watchers',
    },
    {
      title: 'Forks',
      value: stats.forks_count,
      icon: <ForkOutlined style={iconStyle} />,
      tooltip: 'Number of repository forks',
      link: 'https://github.com/mldangelo/personal-site/network/members',
    },
    {
      title: 'Open Issues',
      value: stats.open_issues_count,
      icon: <IssuesCloseOutlined style={iconStyle} />,
      tooltip: 'Number of open issues',
      link: 'https://github.com/mldangelo/personal-site/issues',
    },
  ];

  const renderContent = () => {
    if (loading) {
      return (
        <Row gutter={[24, 24]}>
          {Array(6)
            .fill(null)
            .map((_, index) => (
              <Col key={index} xs={24} sm={12} lg={8}>
                <Card size="small" bordered={false}>
                  <Skeleton active paragraph={false} />
                </Card>
              </Col>
            ))}
        </Row>
      );
    }

    if (error) {
      return (
        <Card size="small" bordered={false} style={{ background: token.colorErrorBg }}>
          <Space>
            <WarningOutlined style={{ color: token.colorError }} />
            <Text type="danger">Error loading stats: {error}</Text>
          </Space>
        </Card>
      );
    }

    return (
      <Row gutter={[24, 24]}>
        {siteStats.map((stat) => (
          <Col key={stat.title} xs={24} sm={12} lg={8}>
            <Tooltip title={stat.tooltip}>
              <Card
                size="small"
                bordered={false}
                style={{
                  background: token.colorFillQuaternary,
                  transition: `all ${token.motionDurationMid}`,
                }}
                onClick={
                  stat.link
                    ? () => window.open(stat.link, '_blank', 'noopener,noreferrer')
                    : undefined
                }
                hoverable={!!stat.link}
              >
                <Statistic
                  title={stat.title}
                  value={stat.value}
                  prefix={stat.icon}
                  suffix={stat.suffix}
                  valueStyle={{
                    fontSize: token.fontSizeLG,
                    color: stat.link ? token.colorLink : token.colorText,
                    cursor: stat.link ? 'pointer' : 'default',
                    transition: `all ${token.motionDurationMid}`,
                  }}
                />
              </Card>
            </Tooltip>
          </Col>
        ))}
      </Row>
    );
  };

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
        <Space align="center">
          <GithubOutlined style={{ fontSize: token.fontSizeXL }} />
          <Title level={3} style={{ margin: 0 }}>
            Site Stats
          </Title>
        </Space>

        {renderContent()}
      </Space>
    </Card>
  );
};

export default Site;
