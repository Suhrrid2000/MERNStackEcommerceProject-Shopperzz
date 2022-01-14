import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  updateStory,
  getStoryDetails,
} from "../../actions/storyAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DescriptionIcon from "@material-ui/icons/Description";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import SideBar from "./Sidebar";
import { UPDATE_STORY_RESET } from "../../constants/storyConstants";

const UpdateStory = ({ history, match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { error, story } = useSelector((state) => state.storyDetails);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.story);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);


  const storyId = match.params.id;

  useEffect(() => {
    if (story && story._id !== storyId) {
      dispatch(getStoryDetails(storyId));
    } else {
      setName(story.name);
      setDescription(story.description);
      setOldImages(story.images);
    }
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearErrors());
    }

    if (isUpdated) {
      alert.success("Story Updated Successfully");
      history.push("/admin/stories");
      dispatch({ type: UPDATE_STORY_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    history,
    isUpdated,
    storyId,
    story,
    updateError,
  ]);

  const updateStorySubmitHandler = (e) => {
    e.preventDefault();

    const myForm = new FormData();

    myForm.set("name", name);
    myForm.set("description", description);
    images.forEach((image) => {
      myForm.append("images", image);
    });
    dispatch(updateStory(storyId, myForm));
  };

  const updateStoryImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Edit Story" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer">
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateStorySubmitHandler}
          >
            <h1>Update Story</h1>

            <div>
              <SpellcheckIcon />
              <input
                type="text"
                placeholder="Organization Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <DescriptionIcon />

              <textarea
                placeholder="Story Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                cols="30"
                rows="1"
              ></textarea>
            </div>

            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateStoryImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Story Preview" />
                ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Story Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateStory;