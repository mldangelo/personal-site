import React, {Component} from 'react';
import Header from './components/Header';
import Nav from './components/Nav';
import About from './components/About';
import Stats from './components/Stats';
import Contact from './components/Contact';
import Projects from './components/Projects';


class App extends Component {
  render() {
    return (
      <div id="wrapper">
        <Header/>
        <Nav/>
        {/*
          <Stats/>
        <div className="container">
          <About/>
        </div>  */}
        {/*
          <Stats/>
        <Projects/>
        <Contact/>
        */}
      </div>
    );
  }
}

export default App;
