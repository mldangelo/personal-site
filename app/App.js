import React, {Component} from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import About from './components/About';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Projects from './components/Projects';
import AboutSite from './components/AboutSite';


class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Header/>

        <div id="main">
          <AboutSite/>
        </div>

        <Nav/>
      </div>
    );
  }
}

export default App;
