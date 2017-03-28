import courses from '../../../app/data/protected/courses';
import degrees from '../../../app/data/protected/degrees';
import positions from '../../../app/data/protected/positions';
import { skills, categories } from '../../../app/data/protected/skills';

export default (req, res) => {
  res.json({
    success: true,
    courses,
    degrees,
    positions,
    skills,
    categories,
  });
};
