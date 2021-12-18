import React from "react";
import "./Contact.css";
import Shopping from "../../../images/Shopping.jpg";
import { Button } from "@material-ui/core";

const Contact = () => {
  return (
        <div className="contactContainer">
          <img id = "bg" src={Shopping} alt="Shopping"/>
          <a className="mailBtn" href="mailto:shopperzzteam247@gmail.com">
          <Button>Contact: shopperzzteam247@gmail.com</Button>
          </a>
        </div>     
  );
};

export default Contact;