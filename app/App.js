import React, {Component} from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import About from './components/About';
import SiteStats from './components/SiteStats';
import Contact from './components/Contact';
import Projects from './components/Projects';
import AboutSite from './components/AboutSite';
import Resume from './components/Resume';


class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Header/>

        <div id="main">
          <AboutSite/>
          <Projects/>
          <Resume/>
          <SiteStats/>
          <Contact/>
        </div>

        <Nav/>
      </div>
    );
  }
}

export default App;
