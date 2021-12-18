import React from "react";
import "./About.css";
import { Button, Typography, Avatar } from "@material-ui/core";
import LinkedInIcon from '@material-ui/icons/LinkedIn';
import InstagramIcon from "@material-ui/icons/Instagram";
const About = () => {
  const visitInstagram = () => {
    window.location = "https://www.instagram.com/bongo._.chhele/";
  };
  return (
    <div className="aboutSection">
      <div></div>
      <div className="aboutSectionGradient"></div>
      <div className="aboutSectionContainer">
        <Typography component="h1">About Us</Typography>

        <div>
          <div>
            <Avatar
              style={{ width: "10vmax", height: "10vmax", margin: "2vmax 0" }}
              src="https://res.cloudinary.com/myapplication/image/upload/v1639720782/avatars/ufdmt09fj1d7zbl4ccyy.jpg"
              alt="Founder"
            />
            <Typography>Suhrrid Banerjee</Typography>
            <Button onClick={visitInstagram} color="primary">
              Visit My Instagram
            </Button>
            <span>
              This is my first attempt in building a full stack e-commerce website using MERN stack. It took me around 2 months to complete
              the project and finally its here. Please do use it to fulfill your day to day shopping needs and also feel free to report any
              bugs or glitches you face during the use. Thank you everyone! 
            </span>
          </div>
          <div className="aboutSectionContainer2">
            <Typography component="h2">Connect with us</Typography>
            <a
              href="https://www.linkedin.com/in/suhrrid-banerjee-a2b67b198/"
              target="blank"
            >
              <LinkedInIcon className="roomSvgIcon" />
            </a>

            <a href="https://instagram.com/bongo._.chhele" target="blank">
              <InstagramIcon className="instagramSvgIcon" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;