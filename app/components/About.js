import React, {Component} from 'react';

class About extends Component {
  render() {
    return (
      <div>
        <section id="about">
            <ul class="list-inline">
                <li>
                    <header>
                        <h3>What I Do</h3></header>
                    <p>Product Management<br/> Data Science<br/> Machine Learning<br/> Full Stack Web Development<br/> Space Systems<br/> Hardware Design</p>
                </li>
                <li>
                    <header>
                        <h3>What I Enjoy</h3></header>
                    <p>Space<br/> Skiing<br/> Photography<br/> Travel</p>
                </li>
            </ul>
        </section>
      </div>
    );
  }
}

export default About;
