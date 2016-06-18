import React, {Component} from 'react';

import Header from './components/Header';

import About from './components/About';
import Projects from './components/Projects';
import Resume from './components/Resume';
import Stats from './components/Stats';
import Contact from './components/Contact';

import Nav from './components/Nav';

class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Header/>

        <div id="main">
          <About/>
          <Projects/>
          <Resume/>
          <Stats/>
          <Contact/>
        </div>

        <Nav/>
      </div>
    );
  }
}

export default App;
