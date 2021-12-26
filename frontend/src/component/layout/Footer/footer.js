import React from "react";
import playStore from "../../../images/playstore.png";
import appStore from "../../../images/Appstore.png";
import logo from "../../../images/logo.png";
import "./Footer.css";

const Footer = () => {
  return (
    <footer id="footer">
      <div className="leftFooter">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download Our App for Android and IOS</p>
        <img src={playStore} alt="playstore" />
        <img src={appStore} alt="Appstore" />
      </div>

      <div className="midFooter">
        <img src={logo} alt="playstore" />
        <p>Quality assured</p>

        <p>Copyrights 2021 &copy; Suhrrid Banerjee</p>
      </div>

      <div className="rightFooter">
        <h4>Follow Us On</h4>
        <a href="https://www.instagram.com/bongo._.chhele/">Instagram</a>
        <a href="https://twitter.com/Suhrrid_2000">Twitter</a>
        <a href="https://www.linkedin.com/in/suhrrid-banerjee-a2b67b198">LinkedIn</a>
        <a href="https://www.facebook.com/suhrrid.banerjee/">Facebook</a>
      </div>
    </footer>
  );
};

export default Footer;