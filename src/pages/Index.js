import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={
      "Claire Fram's personal website"
      + 'Product Manager and Entrepreneur. Based in San Francisco.'
    }
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            <Link to="/">Hello</Link>
          </h2>
          <p>
            I&apos;m Claire Fram. A San Francisco-based product manager
            with a focus on geospatial and transit-tech.
          </p>
        </div>
      </header>
      <p>
        I have a decade of experience in product management for geospatial and open source products.
        My specialism is building technical tools for planners, transport professionals
        and health-care providers.
      </p>
      <p>
        In 2020 I co-founded <Link to="https:diagonal.works/"> Diagonal</Link>, a civic tech data analytics company.{' '}
        We built some tools along the way:
        <li><Link to="https://github.com/diagonalworks/diagonal-b6"> bedrock (b6)</Link> - a compact represenetation of geospatial data and analysis engine.</li>
        <li><Link to="https://github.com/diagonalworks/diagonal-pets"> Privacy enhancing technology</Link> to predict the risk of virus-infection, based on the aggregate number of visitors to places.</li>
        <li><Link to="https://github.com/diagonalworks/ucl-population-health"> Population health modelling</Link> to understand health care supply/demand scenarios using a synthetic UK population.</li>
      </p>
      <p>
        Before Diagonal, I spent many years at <Link to="https://arup.com/">Arup</Link> where I led multiple data analytics
        products for transport professionals - including the <Link to="https://www.arup.com/services/city-modelling-lab/"> City Modelling Lab.</Link>

      </p>
      <p>
        It&apos;s nice to do things outside of work too.
      </p>
      <p>
        I run marathons. I&apos;ve finished 7: San Francisco, Stockholm,
        London, Madrid, Budapest, Paris, Milan.
        I volunteer with the <Link to="https://www.citysurfproject.com/">City Surf Project</Link> and <Link to="https://www.mewaterfoundation.org/">MeWater Foundation. </Link>
        I am a member of the <Link to="https://sfbike.org/">San Francisco Bicycle Coalition</Link> and <Link to="https://walksf.org/"> Walk SF</Link> - where I advocate for safer streets for everyone.

      </p>
      <p>
        You can check out my{' '}
        <Link to="/resume">resume</Link> or{' '}
        <Link to="/contact">contact</Link> me for more.
      </p>
    </article>
  </Main>
);

export default Index;
