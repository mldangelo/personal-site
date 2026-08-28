import dayjs from 'dayjs';

import type { Achievement, Certification } from '@/data/resume/certifications';
import { achievements } from '@/data/resume/certifications';

interface CertificationsProps {
  data: Certification[];
  achievements?: Achievement[];
}

export default function Certifications({
  data,
  achievements: achievementData = achievements,
}: CertificationsProps) {
  return (
    <div className="certifications">
      <div className="title">
        <h2>Certifications</h2>
      </div>
      <ul className="certification-list">
        {data.map((certification) => (
          <li key={certification.name}>
            <strong>{certification.name}</strong>
            <span> · {certification.issuer}</span>
            <span className="certification-date">
              {' '}
              <time dateTime={certification.startDate}>
                {dayjs(certification.startDate).format('MMMM YYYY')}
              </time>{' '}
              –{' '}
              <time dateTime={certification.endDate}>
                {dayjs(certification.endDate).format('MMMM YYYY')}
              </time>
            </span>
          </li>
        ))}
      </ul>
      <h3 className="certification-subtitle">Selected achievements</h3>
      <ul className="points">
        {achievementData.map(({ description }) => (
          <li key={description}>{description}</li>
        ))}
      </ul>
    </div>
  );
}
