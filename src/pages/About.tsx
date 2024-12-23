import {
  Typography,
  Layout,
  Card,
  Space,
  Timeline,
  List,
  Tag,
  Grid,
  theme,
  Row,
  Col,
  Avatar,
  Tooltip,
  Divider,
  Tabs,
  Statistic,
  Empty,
} from 'antd';
import {
  GlobalOutlined,
  HeartOutlined,
  BulbOutlined,
  LinkOutlined,
  HistoryOutlined,
  SmileOutlined,
  RocketOutlined,
  TrophyOutlined,
  BookOutlined,
  CompassOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';
import Main from '../layouts/Main';

const { Title, Text, Link: TextLink, Paragraph } = Typography;
const { Content } = Layout;
const { useBreakpoint } = Grid;

const MotionCard = motion(Card);

const About = () => {
  const screens = useBreakpoint();
  const { token } = theme.useToken();

  const likes = [
    { text: 'Running', icon: '🏃‍♂️' },
    { text: 'Skiing', icon: '⛷️' },
    { text: 'Sailing', icon: '⛵' },
    { text: 'Space', icon: '🚀' },
    { text: 'Summer', icon: '☀️' },
    { text: 'Books', icon: '📚', link: 'https://www.goodreads.com/mdangelo' },
    { text: 'Colored Pencils', icon: '🎨', description: 'Faber-Castell Polychromos' },
    { text: 'Podcasts', icon: '🎧' },
    { text: 'Photography', icon: '📸', link: 'https://instagram.com/dangelosaurus' },
    { text: 'Good Design', icon: '✨' },
  ];

  const funFacts = [
    {
      icon: '🎨',
      fact: 'I have a list of thousands of ideas, like creating matching bow ties for cats and humans.',
    },
    {
      icon: '✏️',
      fact: 'I almost always have a sketchbook with me and a 01 Sakura Pigma Micron Pen.',
    },
    {
      icon: '🗺️',
      fact: "I can't locate every country on a map.",
    },
    {
      icon: '🗑️🔥',
      fact: 'I operate a small angel fund with terrible returns.',
    },
    {
      icon: '🛹',
      fact: 'I break about 30 traffic laws on a skateboard or bicycle every single day.',
    },
    {
      icon: '☕',
      fact: 'I stack-rank coffee shops, restaurants, and every dog I see in New York.',
    },
    {
      icon: '🎮',
      fact: 'I was unstoppable at laser tag after reverse engineering the charging station.',
    },
    {
      icon: '⚡',
      fact: 'I built several Tesla Coils, including one of the first audio modulated coils.',
    },
    {
      icon: '🌍',
      fact: "I've been to approximately 50 countries and counting.",
    },
  ];

  const dreams = [
    'Inspiring and feeling inspired.',
    'Enabling a brighter future for everyone, regardless of political or socioeconomic status.',
    'Treating every individual with genuine kindness and respect.',
    'Staying curious.',
    'Continually improving.',
  ];

  const admiredWebsites = [
    { name: 'Alex Peysakhovich', url: 'http://alexpeys.github.io/' },
    { name: 'Chris Lengerich', url: 'http://www.chrislengerich.com/' },
    { name: 'Chris Saad', url: 'https://www.chrissaad.com/' },
    { name: 'Duncan Tomlin', url: 'http://duncantomlin.com/' },
    { name: 'Ed Kearney', url: 'https://edkearney.com/' },
    { name: 'Hawley Moore', url: 'http://hawleymoore.com/' },
    { name: 'Holman Gao', url: 'https://golmansax.com/' },
    { name: 'Ian Webster', url: 'http://ianww.com/' },
    { name: 'Johanna Flato', url: 'https://www.johannaflato.com/' },
  ];

  const history = [
    {
      year: 1993,
      event:
        'My parents put a computer in my bedroom when I was 3. It was an old Tandy that ran MS-DOS.',
      icon: '🖥️',
    },
    {
      year: 1995,
      event: 'We subscribed to AOL. I still remember installing it from a floppy disk.',
      icon: '💾',
    },
    {
      year: 1996,
      event: 'My uncle purchased MegaRace from Media Play.',
      icon: '🎮',
    },
    {
      year: 2000,
      event: 'Built my first website with Microsoft FrontPage on our Pentium III Gateway.',
      icon: '🌐',
    },
    {
      year: 2003,
      event: "Built my first Tesla Coil without my parents' permission.",
      icon: '⚡',
    },
    {
      year: 2004,
      event: 'Set the all-time high record at my local laser tag facility.',
      icon: '🎯',
    },
    {
      year: 2005,
      event: 'Went to space camp and fell in love with space.',
      icon: '🚀',
    },
  ];

  const travelData = {
    overview: {
      totalCountries: 50,
      citiesLivedIn: [
        'Buffalo',
        'Palo Alto',
        'Mountain View',
        'San Francisco',
        'Seattle',
        'New York City',
      ],
      currentLocation: 'New York City',
    },
    yearlyTravel: [
      {
        year: 2016,
        countries: [
          'Canada',
          'Ethiopia',
          'Austria',
          'Germany',
          'Belgium',
          'Ireland',
          'Northern Ireland',
          'Italy',
          'Romania',
          'Sweden',
          'Norway',
          'Svalbard',
          'Panama',
          'Costa Rica',
          'Uganda',
          'Japan',
          'UAE',
        ],
        highlight: 'First time visiting Africa',
      },
      {
        year: 2017,
        countries: [
          'Canada',
          'Japan',
          'Denmark',
          'Germany',
          'Sweden',
          'Estonia',
          'Russia',
          'Netherlands',
          'Belgium',
          'UK',
          'Spain',
          'Iceland',
          'France',
          'Switzerland',
          'Ethiopia',
          'Luxembourg',
        ],
        highlight: 'Explored Northern Europe extensively',
      },
      {
        year: 2018,
        countries: ['Canada', 'France', 'Italy', 'Israel', 'UK'],
        highlight: 'First visit to Israel',
      },
      {
        year: 2019,
        countries: ['Canada', 'England', 'France', 'Switzerland'],
        highlight: 'Last year of frequent travel before pandemic',
      },
      {
        year: 2020,
        countries: [],
        highlight: 'Stayed in New York, traveled barely 20 blocks',
      },
      {
        year: 2021,
        countries: [],
        highlight: 'Continued remodeling an apartment',
      },
      {
        year: 2022,
        countries: ['UK', 'France', 'Greece', 'Belgium', 'Luxembourg', 'Germany', 'Kenya'],
        highlight: 'Return to international travel',
      },
      {
        year: 2023,
        countries: ['France', 'UK', 'Ireland', 'Rwanda'],
        highlight: 'Explored Rwanda',
      },
    ],
  };

  const renderTravelOverview = () => (
    <Row gutter={[16, 16]}>
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Countries Visited"
            value={travelData.overview.totalCountries}
            prefix={<GlobalOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Current Location"
            value={travelData.overview.currentLocation}
            prefix={<HomeOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24} sm={8}>
        <Card bordered={false}>
          <Statistic
            title="Cities Lived In"
            value={travelData.overview.citiesLivedIn.length}
            prefix={<EnvironmentOutlined />}
          />
        </Card>
      </Col>
      <Col xs={24}>
        <Text type="secondary">Cities I've called home: </Text>
        <Space size={[8, 8]} wrap>
          {travelData.overview.citiesLivedIn.map((city) => (
            <Tag
              key={city}
              color="blue"
              style={{
                borderRadius: token.borderRadiusLG,
                padding: `${token.paddingXS}px ${token.padding}px`,
              }}
            >
              <Space>
                <EnvironmentOutlined />
                {city}
              </Space>
            </Tag>
          ))}
        </Space>
      </Col>
    </Row>
  );

  const renderYearlyTravel = () => (
    <Timeline
      mode="left"
      items={travelData.yearlyTravel.map((year) => ({
        color: year.countries.length > 0 ? 'blue' : 'gray',
        label: <Text strong>{year.year}</Text>,
        children: (
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            {year.countries.length > 0 ? (
              <>
                <Space wrap size={[8, 8]}>
                  {year.countries.map((country) => (
                    <Tag
                      key={country}
                      style={{
                        borderRadius: token.borderRadiusLG,
                        padding: `${token.paddingXS}px ${token.padding}px`,
                      }}
                    >
                      {country}
                    </Tag>
                  ))}
                </Space>
                <Text type="secondary" italic>
                  {year.highlight}
                </Text>
              </>
            ) : (
              <Text type="secondary" italic>
                {year.highlight}
              </Text>
            )}
          </Space>
        ),
      }))}
    />
  );

  return (
    <Main title="About" description="Learn about Michael D'Angelo">
      <Content
        style={{
          padding: screens.sm ? token.paddingLG : token.padding,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* Intro Section */}
          <MotionCard
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ borderRadius: token.borderRadiusLG }}
            bodyStyle={{ padding: token.paddingLG }}
          >
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <Space align="center" size="large">
                <Avatar
                  size={120}
                  src="/images/me.jpg"
                  style={{
                    border: `4px solid ${token.colorPrimary}`,
                    boxShadow: token.boxShadowTertiary,
                  }}
                />
                <Space direction="vertical" size={4}>
                  <Title level={2} style={{ marginBottom: 0 }}>
                    About Me
                  </Title>
                  <Text type="secondary" style={{ fontSize: token.fontSizeLG }}>
                    Co-founder & CTO at Promptfoo
                  </Text>
                </Space>
              </Space>
              <Paragraph style={{ fontSize: token.fontSizeLG, marginBottom: token.marginLG }}>
                I am the co-founder and CTO of{' '}
                <TextLink href="https://promptfoo.dev" target="_blank">
                  Promptfoo
                </TextLink>
                , where we're building open-source tools to evaluate, find, and fix vulnerabilities
                in LLMs. Before Promptfoo, I was the VP of Engineering at{' '}
                <TextLink href="https://www.usesmileid.com" target="_blank">
                  SmileID
                </TextLink>
                , where I led the development of tools that have helped over 170 million people in
                Africa gain access to financial services.
              </Paragraph>
              <Paragraph style={{ fontSize: token.fontSize }}>
                In my spare time, I enjoy investing in people and ideas through a{' '}
                <TextLink href="https://skepticalinvestments.biz" target="_blank">
                  small venture fund
                </TextLink>
                , focusing on projects with high social impact. If you think I can be helpful to you
                or your cause, or if you're interested in collaborating, feel free to get in touch.
              </Paragraph>
            </Space>
          </MotionCard>

          {/* History Timeline */}
          <MotionCard
            title={
              <Space>
                <HistoryOutlined style={{ fontSize: token.fontSizeLG }} />
                <span>My Journey</span>
              </Space>
            }
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            style={{ borderRadius: token.borderRadiusLG }}
            bodyStyle={{ padding: token.paddingLG }}
          >
            <Timeline
              mode={screens.sm ? 'alternate' : 'left'}
              items={history.map((item) => ({
                color: 'blue',
                label: screens.sm ? (
                  <Space>
                    <Text strong>{item.year}</Text>
                    <Text>{item.icon}</Text>
                  </Space>
                ) : undefined,
                children: (
                  <Space direction="vertical" size={0}>
                    {!screens.sm && (
                      <Space>
                        <Text strong>{item.year}</Text>
                        <Text>{item.icon}</Text>
                      </Space>
                    )}
                    <Text>{item.event}</Text>
                  </Space>
                ),
              }))}
            />
          </MotionCard>

          <Row gutter={[16, 16]}>
            {/* Interests */}
            <Col xs={24} md={12}>
              <MotionCard
                title={
                  <Space>
                    <HeartOutlined style={{ fontSize: token.fontSizeLG }} />
                    <span>Things I Like</span>
                  </Space>
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                <Space size={[8, 8]} wrap>
                  {likes.map((like) => (
                    <Tooltip key={like.text} title={like.description}>
                      <Tag
                        color="blue"
                        style={{
                          borderRadius: token.borderRadiusLG,
                          padding: `${token.paddingXS}px ${token.padding}px`,
                          cursor: like.link ? 'pointer' : 'default',
                        }}
                        onClick={like.link ? () => window.open(like.link, '_blank') : undefined}
                      >
                        <Space>
                          <span>{like.icon}</span>
                          <span>{like.text}</span>
                        </Space>
                      </Tag>
                    </Tooltip>
                  ))}
                </Space>
              </MotionCard>
            </Col>

            {/* Fun Facts */}
            <Col xs={24} md={12}>
              <MotionCard
                title={
                  <Space>
                    <SmileOutlined style={{ fontSize: token.fontSizeLG }} />
                    <span>Fun Facts</span>
                  </Space>
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                <List
                  size="large"
                  dataSource={funFacts}
                  renderItem={(item) => (
                    <List.Item>
                      <Space align="start">
                        <Text style={{ fontSize: token.fontSizeLG }}>{item.icon}</Text>
                        <Text>{item.fact}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </MotionCard>
            </Col>

            {/* Dreams */}
            <Col xs={24} md={12}>
              <MotionCard
                title={
                  <Space>
                    <RocketOutlined style={{ fontSize: token.fontSizeLG }} />
                    <span>I Dream Of</span>
                  </Space>
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                <List
                  size="large"
                  dataSource={dreams}
                  renderItem={(item) => (
                    <List.Item>
                      <Space align="start">
                        <Text>✨</Text>
                        <Text>{item}</Text>
                      </Space>
                    </List.Item>
                  )}
                />
              </MotionCard>
            </Col>

            {/* Admired Websites */}
            <Col xs={24} md={12}>
              <MotionCard
                title={
                  <Space>
                    <LinkOutlined style={{ fontSize: token.fontSizeLG }} />
                    <span>Websites I Admire</span>
                  </Space>
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                <List
                  size="large"
                  dataSource={admiredWebsites}
                  renderItem={(item) => (
                    <List.Item>
                      <TextLink href={item.url} target="_blank">
                        {item.name}
                      </TextLink>
                    </List.Item>
                  )}
                />
              </MotionCard>
            </Col>

            {/* Travel / Geography */}
            <Col xs={24}>
              <MotionCard
                title={
                  <Space>
                    <GlobalOutlined style={{ fontSize: token.fontSizeLG }} />
                    <span>Travel / Geography</span>
                  </Space>
                }
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                style={{ height: '100%', borderRadius: token.borderRadiusLG }}
                bodyStyle={{ padding: token.paddingLG }}
              >
                <Tabs
                  defaultActiveKey="overview"
                  items={[
                    {
                      key: 'overview',
                      label: (
                        <Space>
                          <GlobalOutlined />
                          Overview
                        </Space>
                      ),
                      children: renderTravelOverview(),
                    },
                    {
                      key: 'timeline',
                      label: (
                        <Space>
                          <ClockCircleOutlined />
                          Travel Timeline
                        </Space>
                      ),
                      children: renderYearlyTravel(),
                    },
                  ]}
                />
              </MotionCard>
            </Col>
          </Row>
        </Space>
      </Content>
    </Main>
  );
};

export default About;
