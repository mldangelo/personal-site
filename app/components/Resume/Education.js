import React from 'react';

import Degree from './Education/Degree';
import degrees from '../../data/degrees';

const getRows = () => degrees.map(degree => (
  <Degree
    data={degree}
    key={degree.school}
  />
));

const Education = () => (
  <div className="education" id="education">
    <div className="title">
      <h3>Education</h3>
    </div>
    {getRows()}
  </div>
);

export default Education;
