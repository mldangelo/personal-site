import React, {Component} from 'react';
import Nav from './components/Nav';
import Contact from './components/Contact';

class App extends Component {
  render() {
    return (
      <div>
        <Nav/>
        <Contact/>
      </div>
    );
  }
}

export default App;
