import React from 'react';

export interface Label {
  title: string;
  category: string[];
}

export interface Category {
  name: string;
  color: string;
}

export interface LabelsProps {
  labels: Label[];
  categories?: Category[];
}

const Labels: React.FC<LabelsProps> = ({ labels, categories = [] }) => {
  const getLabelStyle = (category: string): React.CSSProperties => ({
    background: categories.find((cat) => cat.name === category)?.color,
    padding: '0.3em 0.8em',
    margin: '0.3em',
    borderRadius: '3px',
    color: 'white',
    display: 'inline-block',
    fontSize: '9pt',
  });

  return (
    <div className="labels" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5em' }}>
      {labels.map((label) => (
        <span key={label.title} style={getLabelStyle(label.category[0])}>
          {label.title}
        </span>
      ))}
    </div>
  );
};

export default Labels;
