import courses from '../../app/data/courses';
import degrees from '../../app/data/degrees';
import positions from '../../app/data/positions';
import { skills, categories } from '../../app/data/skills';

export default (req, res) => {
  res.json({
    courses,
    degrees,
    positions,
    skills,
    categories,
  });
};
