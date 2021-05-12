import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div>
    <h3>
      <a href={data.link}>{data.title}</a><br />
    </h3>
    <h4> <a href={data.journallink}>{data.journal}</a><br /> Author: {data.author} <br /><a href={data.journaleditorlink}>{data.journaleditor}</a><br /> ISBN: {data.ISBN} <br /><time>{dayjs(data.date).format('MMMM, YY')}</time> </h4>
    <br />
    <div>
      <h6> Abstract </h6>
      <p style={{ lineHeight: 1.6, textAlign: 'justify' }}>{data.desc}</p>
      <h6> Keywords </h6>
      <p>{data.keywords}</p>
      <h6 style={{ color: 'purple' }}> <a href={data.paperlink}>Find Paper Here</a> </h6>
    </div>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    journallink: PropTypes.string.isRequired,
    journaleditorlink: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    author: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
    journal: PropTypes.string.isRequired,
    journaleditor: PropTypes.string.isRequired,
    ISBN: PropTypes.number.isRequired,
    keywords: PropTypes.string.isRequired,
    paperlink: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
