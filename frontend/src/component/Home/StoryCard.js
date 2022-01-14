import React from 'react';
import {Link} from "react-router-dom";
import './StoryCard.css';

const StoryCard = ({ story }) => {
   
    return (
        <Link className="storyCard" to={`/story/${story._id}`}>
        <img src={story.images[0].url} alt={story.name} />
        <p>{story.name}</p>
      </Link>
    );
  };
  
  export default StoryCard;
