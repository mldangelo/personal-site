import React from "react";
import { Link } from "react-router-dom";

import ContactIcons from "../Contact/ContactIcons";

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpeg`} alt="" />
      </Link>
      <header>
        <h2>Himanshu Arora</h2>
        <p
          style={{
            textTransform: "initial",
            letterSpacing: "normal",
          }}
        >
          {/* Top Rated Seller on{" "}
          <a href="https://www.fiverr.com/himanshu_arora1">Fiverr</a> |  */}
          ReactJS | NextJS | GatsbyJS | Angular | NodeJS | Wordpress
        </p>
        {/* <p><a href="mailto:himanshu73188@gmail.com">himanshu73188@gmail.com</a></p>
        <p><a href="tel:h+919541225322">+91 9541-225322</a></p> */}
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Himanshu Arora, I craft groundbreaking experiences through
        Web Development. I am a <b>Senior Fullstack Web Developer.</b>
        {/* at{" "}
        <a href="https://www.fiverr.com/himanshu_arora1">Fiverr International Limited</a> as a{" "}
        <strong>
          Top Rated Seller (highest status on{" "}
          <a href="https://www.fiverr.com/himanshu_arora1">Fiverr</a>)
        </strong>
        . */}
      </p>
      <ul className="actions">
        <li>
          {!window.location.pathname.includes("/resume") ? (
            <Link to="/resume" className="button">
              Learn More
            </Link>
          ) : (
            <Link to="/about" className="button">
              About Me
            </Link>
          )}
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Himanshu Arora <Link to="/">himanshuarora.dev</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;
