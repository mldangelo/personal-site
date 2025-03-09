import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import Markdown from 'markdown-to-jsx';

const Job = ({
  data: {
    name, position, url, startDate, endDate, summary, highlights, projects,
  },
}) => (
  <article className="jobs-container" style={{ marginBottom: '40px' }}>
    {/* Company Name and Position */}
    <header style={{ marginBottom: '0px' }}>
      <h4 className="company-name" style={{ marginBottom: '0px' }}>
        <a href={url}>{name}</a> - {position}
      </h4>
      <p className="company-daterange" style={{ margin: '0px' }}>
        {dayjs(startDate).format('MMMM YYYY')} -{' '}
        {endDate ? dayjs(endDate).format('MMMM YYYY') : 'PRESENT'}
      </p>
    </header>

    {/* Company Summary */}
    {summary && (
      <div className="company-summary" style={{ margin: '0px', padding: '0px' }}>
        <Markdown
          options={{
            overrides: {
              p: {
                props: {
                  className: 'summary',
                  style: { margin: '0px' },
                },
              },
            },
          }}
        >
          {summary}
        </Markdown>
      </div>
    )}

    {/* Company Highlights */}
    {highlights && (
      <div className="company-highlights">
        <ul className="points" style={{ margin: '0px' }}>
          {highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      </div>
    )}

    {/* Projects */}
    {projects && (
      <div className="projects" style={{ margin: '10px 0 0 20px' }}>
        {projects.map((project) => (
          <div key={project.name} className="project" style={{ marginBottom: '10px' }}>
            {/* Project Name and Duration */}
            <h5 className="project-name" style={{ marginBottom: '2px' }}>{project.name}</h5>
            <p className="project-daterange" style={{ marginTop: '0' }}>
              {dayjs(project.startDate).format('MMMM YYYY')} -{' '}
              {project.endDate ? dayjs(project.endDate).format('MMMM YYYY') : 'PRESENT'}
            </p>

            {/* Project Summary */}
            {project.summary && (
              <div className="project-summary">
                <Markdown
                  options={{
                    overrides: {
                      p: {
                        props: {
                          className: 'summary',
                          style: { margin: '0px' },
                        },
                      },
                    },
                  }}
                >
                  {project.summary}
                </Markdown>
              </div>
            )}

            {/* Project Highlights */}
            {project.highlights && (
              <div className="project-highlights">
                <ul className="points" style={{ margin: 0 }}>
                  {project.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </article>
);

Job.propTypes = {
  data: PropTypes.shape({
    name: PropTypes.string.isRequired,
    position: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
    endDate: PropTypes.string,
    summary: PropTypes.string,
    highlights: PropTypes.arrayOf(PropTypes.string.isRequired),
    projects: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string.isRequired,
        startDate: PropTypes.string.isRequired,
        endDate: PropTypes.string,
        summary: PropTypes.string,
        highlights: PropTypes.arrayOf(PropTypes.string.isRequired),
      }),
    ),
  }).isRequired,
};

export default Job;
