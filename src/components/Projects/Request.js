import React from "react";
import { Link } from "react-router-dom";

const Request = () => (
  <div className="request">
    <div className="link-to" id="request" />
    <div className="title">
      <Link to="/contact">
        <h3>Complete Portfolio is available upon request</h3>
      </Link>
    </div>
  </div>
);

export default Request;
