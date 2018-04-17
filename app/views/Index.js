import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main>
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2><Link to="/">About this site</Link></h2>
          <p>A beautiful, responsive, react app written with ES2016.</p>
        </div>
      </header>
      <p> Welcome to my website. Please feel free to read more <Link to="/about">about me</Link>,
      or you can check out my {' '}
        <Link to="/resume">resume</Link>, {' '}
        <Link to="/projects">projects</Link>, {' '}
      view <Link to="/stats">site statistics</Link>, {' '}
      or <Link to="/contact">contact</Link> me.
      </p>
      <p> Source available <a href="https://github.com/mldangelo/mldangelo">here</a>.</p>
      <div className="container" id="icons">
            <div className="row">
              <i className="demo-icon icon-cancel-circled-outline"/>
              <i className="demo-icon icon-cancel-circled-1"/>
              <i className="demo-icon icon-cancel-1"/>
              <i className="demo-icon icon-cancel-circle"/>
            </div>
            <div className="row">
              <div className="the-icons span3" title="Code: 0xe804"><i className="demo-icon icon-cancel-2"></i> <span className="i-name">icon-cancel-2</span><span className="i-code">0xe804</span></div>
              <div className="the-icons span3" title="Code: 0xe805"><i className="demo-icon icon-cancel-circle-1"></i> <span className="i-name">icon-cancel-circle-1</span><span className="i-code">0xe805</span></div>
              <i className="demo-icon icon-cancel-3"/>
              <div className="the-icons span3" title="Code: 0xe807"><i className="demo-icon icon-cancel-4"></i> <span className="i-name">icon-cancel-4</span><span className="i-code">0xe807</span></div>
            </div>
            <div className="row">
              <div className="the-icons span3" title="Code: 0xe808"><i className="demo-icon icon-cancel-circled-3"></i> <span className="i-name">icon-cancel-circled-3</span><span className="i-code">0xe808</span></div>
              <div className="the-icons span3" title="Code: 0xe809"><i className="demo-icon icon-cancel-circled2"></i> <span className="i-name">icon-cancel-circled2</span><span className="i-code">0xe809</span></div>
              <div className="the-icons span3" title="Code: 0xe80a"><i className="demo-icon icon-cancel-5"></i> <span className="i-name">icon-cancel-5</span><span className="i-code">0xe80a</span></div>
              <div className="the-icons span3" title="Code: 0xe80b"><i className="demo-icon icon-cancel-circled-4"></i> <span className="i-name">icon-cancel-circled-4</span><span className="i-code">0xe80b</span></div>
            </div>
            <div className="row">
              <div className="the-icons span3" title="Code: 0xf042"><i className="demo-icon icon-times"></i> <span className="i-name">icon-times</span><span className="i-code">0xf042</span></div>
              <div className="the-icons span3" title="Code: 0xf043"><i className="demo-icon icon-cancel-circled"></i> <span className="i-name">icon-cancel-circled</span><span className="i-code">0xf043</span></div>
              <div className="the-icons span3" title="Code: 0xf06e"><i className="demo-icon icon-cancel-circled-2"></i> <span className="i-name">icon-cancel-circled-2</span><span className="i-code">0xf06e</span></div>
              <div className="the-icons span3" title="Code: 0xf099"><i className="demo-icon icon-twitter"></i> <span className="i-name">icon-twitter</span><span className="i-code">0xf099</span></div>
            </div>
            <div className="row">
              <div className="the-icons span3" title="Code: 0xf09a"><i className="demo-icon icon-facebook"></i> <span className="i-name">icon-facebook</span><span className="i-code">0xf09a</span></div>
              <div className="the-icons span3" title="Code: 0xf09b"><i className="demo-icon icon-github-circled"></i> <span className="i-name">icon-github-circled</span><span className="i-code">0xf09b</span></div>
              <div className="the-icons span3" title="Code: 0xf0c9"><i className="demo-icon icon-bars"></i> <span className="i-name">icon-bars</span><span className="i-code">0xf0c9</span></div>
              <div className="the-icons span3" title="Code: 0xf0e0"><i className="demo-icon icon-mail-alt"></i> <span className="i-name">icon-mail-alt</span><span className="i-code">0xf0e0</span></div>
            </div>
            <div className="row">
              <div className="the-icons span3" title="Code: 0xf0e1"><i className="demo-icon icon-linkedin"></i> <span className="i-name">icon-linkedin</span><span className="i-code">0xf0e1</span></div>
              <div className="the-icons span3" title="Code: 0xf16d"><i className="demo-icon icon-instagram"></i> <span className="i-name">icon-instagram</span><span className="i-code">0xf16d</span></div>
              <div className="the-icons span3" title="Code: 0xf209"><i className="demo-icon icon-angellist"></i> <span className="i-name">icon-angellist</span><span className="i-code">0xf209</span></div>
              <div className="the-icons span3" title="Code: 0xf402"><i className="demo-icon icon-cancel"></i> <span className="i-name">icon-cancel</span><span className="i-code">0xf402</span></div>
            </div>
          </div>

    </article>
  </Main>
);

export default Index;
