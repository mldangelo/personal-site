import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={
      'I am a very curious CS, Math & Physics student at HU Berlin with deep passion for differential geometry, '
      + 'data science & coding. Currently working at SAP'
    }
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            <Link to="/">About this site</Link>
          </h2>
          {/* <p>
            A beautiful, responsive, statically-generated, react application
            written with modern Javascript.
          </p> */}
        </div>
      </header>
      <p>
        Welcome to my website! <br />
        I am super excited to launch my blog here, where I&apos;ll be diving into the fascinating—and often misunderstood—world of mathematics.<br />
        Let&apos;s face it: when most people think of math, the public image is… uninspiring. At best, it&apos;s seen as a mere tool for science; at worst,  
        it&apos;s dismissed as a tedious exercise in number-crunching.<br />
        Contrast this with physics. Many people, even without a deep background, are fascinated by concepts like relativity, quantum mechanics, or  
        black holes. There are movies, documentaries, and endless discussions about these topics.<br />
        This is unfortunate because mathematics is not just about numbers—it&apos;s the rigorous study of the nature of reality itself. And not just physical  
        reality! One reason for its inaccessibility is that mathematics often defies natural language. Physics, at least, describes things we can experience—motion,  
        gravity, time dilation. But mathematics ventures far beyond that, exploring spaces of arbitrary dimension, structures that don&apos;t exist in our physical  
        world, and symmetries that cannot be visualized.<br />
        Another reason, though, is that mathematicians tend to commuWnicate in a language that is incredibly precise and expressive—but also extremely difficult  
        to learn. In my opinion, many mathematicians overuse this language and forget how hard it was to master in the first place. They rarely make an effort  
        to translate their insights into something more accessible for outsiders. This is part of why math students struggle so much in the early years of their  
        studies. There are, of course, inspiring exceptions, but they are rare.<br />
        This is why I want to start writing a blog about mathematics—especially the differential topology of four-manifolds. My goal is to make this fascinating  
        world more accessible to outsiders, to bridge the gap between formal mathematics and intuitive understanding. Occasionally, this journey will lead us  
        into the world of physics as an application of mathematics—reversing the usual.<br />
        Let&apos;s embark on this journey together and uncover the hidden beauty of mathematics!  
      </p>
    </article>
  </Main>
);

export default Index;
