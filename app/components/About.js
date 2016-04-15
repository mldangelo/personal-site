import React, {Component} from 'react';

class About extends Component {
  render() {
    return (
      <div className="about">
        <div className="col-sm-12">
            <ul className="list-inline">
                <li>
                    <header>
                        <h3>What I Do</h3>
                    </header>
                    <p>Product Management<br/> Data Science<br/> Machine Learning<br/> Full Stack Web Development<br/> Space Systems<br/> Hardware Design</p>
                </li>
                <li>
                    <header>
                        <h3>What I Enjoy</h3>
                    </header>
                    <p>Space<br/> Skiing<br/> Photography<br/> Travel</p>
                </li>
            </ul>
        </div>
      </div>
    );
  }
}

export default About;
