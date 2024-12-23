import { Card, Row, Col, Space } from 'antd';
import type { Course as CourseType } from '../../types';
import Course from './Courses/Course';

interface CoursesProps {
  data: CourseType[];
}

const sortCourses = (courses: CourseType[]): CourseType[] =>
  courses.sort((a, b) => {
    if (a.university > b.university) return -1;
    if (a.university < b.university) return 1;
    if (a.number > b.number) return 1;
    if (a.number < b.number) return -1;
    return 0;
  });

const groupCoursesByUniversity = (courses: CourseType[]): Record<string, CourseType[]> =>
  courses.reduce<Record<string, CourseType[]>>((acc, course) => {
    const { university } = course;
    if (!acc[university]) {
      acc[university] = [];
    }
    acc[university].push(course);
    return acc;
  }, {});

const Courses = ({ data = [] }: CoursesProps): JSX.Element => {
  const sortedCourses = sortCourses(data);
  const groupedCourses = groupCoursesByUniversity(sortedCourses);

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      {Object.entries(groupedCourses).map(([university, courses]) => (
        <Card key={university} size="small" title={university} bodyStyle={{ padding: 16 }}>
          <Row gutter={[16, 16]}>
            {courses.map((course) => (
              <Col key={course.number} xs={24} sm={12} lg={8}>
                <Course data={course} />
              </Col>
            ))}
          </Row>
        </Card>
      ))}
    </Space>
  );
};

export default Courses;
