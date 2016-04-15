import React, {Component} from 'react';
import Nav from './components/Nav';
import About from './components/About';
import Contact from './components/Contact';

class App extends Component {
  render() {
    return (
      <div>
        <Nav/>
        <div>
          <About/>
          <Contact/>
        </div>
      </div>
    );
  }
}

export default App;
