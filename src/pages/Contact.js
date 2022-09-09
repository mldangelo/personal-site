import React from "react";
import { Link } from "react-router-dom";

import Main from "../layouts/Main";
import ContactIcons from "../components/Contact/ContactIcons";

const Contact = () => (
  <Main
    title="Contact"
    description="Contact Himanshu Arora via email @ himanshu73188@gmail.com"
  >
    <article className="post" id="contact">
      <header>
        <div className="title">
          <h2 data-testid="heading">
            <Link to="/contact">Contact</Link>
          </h2>
        </div>
      </header>
      <div className="email-at">
        <p>Feel free to get in touch. You can email me at: </p>
        <a href="mailto:himanshu73188@gmail.com">himanshu73188@gmail.com</a>
        <p
          style={{
            marginTop: "10px",
          }}
        >
          You can also reach me on my mobile:
        </p>
        <a href="tel:h+919541225322">+91 9541-225322</a>
      </div>
      <ContactIcons />
    </article>
  </Main>
);

export default Contact;
