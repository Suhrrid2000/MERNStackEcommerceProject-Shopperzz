import React, { useEffect, useState } from "react";
import "./StoryDetails.css";
import { Typography } from "@material-ui/core";
import axios from "axios";
import Carousel from "react-material-ui-carousel";


const StoryDetails = ({match}) => {

  const [storyName, setStoryName] = useState("");

  const [image, setImage] = useState([]);


  const getStoryDetail = async (id) => {
    await axios.get(`/api/v1/story/${id}`)
    .then((response) => {
      const story = response.data.story;
      setStoryName(story.name);
      setImage(story.images);
    })
    .catch((error) => {console.log(error)})
  };

  useEffect(() => {
    //dispatch(getStoryDetails(match.params.id));
    getStoryDetail(match.params.id);

  }, [match.params.id]);

  return (
    <div className="aboutSection1">
      <div className="aboutSectionGradient0"></div>
      <div className="aboutSectionGradient1"></div>
      <div className="aboutSectionContainer1">
        <Typography component="h1">Story from {storyName}</Typography>
        <div className="storyDetails1">
          <Carousel classname="carousel">
              {image && 
               image.map((item,i) => (
               <img
                className="CarouselImage"
                key={item.url}
                src={item.url}
                alt={`${i} Slide`}
                />
              ))}
          </Carousel>
          
        </div>
        
          
      </div>
    </div>
  );
};

export default StoryDetails;