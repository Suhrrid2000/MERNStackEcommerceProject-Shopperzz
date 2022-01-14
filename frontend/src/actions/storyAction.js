import axios from "axios";

import {
  NEW_STORY_REQUEST,
  NEW_STORY_SUCCESS,
  NEW_STORY_FAIL,
  ALL_STORY_FAIL,
  ALL_STORY_REQUEST,
  ALL_STORY_SUCCESS,
  ADMIN_STORY_REQUEST,
  ADMIN_STORY_SUCCESS,
  ADMIN_STORY_FAIL,
  CLEAR_ERRORS,
  STORY_DETAILS_REQUEST,
  STORY_DETAILS_SUCCESS,
  STORY_DETAILS_FAIL,
  DELETE_STORY_REQUEST,
  DELETE_STORY_SUCCESS,
  DELETE_STORY_FAIL,
  UPDATE_STORY_REQUEST,
  UPDATE_STORY_SUCCESS,
  UPDATE_STORY_FAIL
} from "../constants/storyConstants";


// Get All Stories
export const getStory = () => async (dispatch) => {
    try {
      dispatch({ type: ALL_STORY_REQUEST });

      const { data } = await axios.get("/api/v1/stories");

      dispatch({
        type: ALL_STORY_SUCCESS,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: ALL_STORY_FAIL,
        payload: error.response.data.message,
      });
    }
  };


// Get All Stories For Admin
export const getAdminStory = () => async (dispatch) => {
    try {
      dispatch({ type: ADMIN_STORY_REQUEST });
  
      const { data } = await axios.get("/api/v1/admin/stories");
  
      dispatch({
        type: ADMIN_STORY_SUCCESS,
        payload: data.stories,
      });
    } catch (error) {
      dispatch({
        type: ADMIN_STORY_FAIL,
        payload: error.response.data.message,
      });
    }
  };



// Create Story
export const createStory = (storyData) => async (dispatch) => {
  try {
    dispatch({ type: NEW_STORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.post(
      `/api/v1/admin/story/new`,
      storyData,
      config
    );

    dispatch({
      type: NEW_STORY_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: NEW_STORY_FAIL,
      payload: error.response.data.message,
    });
  }
};


// Get Story Details
export const getStoryDetails = (id) => async (dispatch) => {
  try {
    dispatch({ type: STORY_DETAILS_REQUEST });

    const { data } = await axios.get(`/api/v1/story/${id}`);

    dispatch({
      type: STORY_DETAILS_SUCCESS,
      payload: data.story,
    });
  } catch (error) {
    dispatch({
      type: STORY_DETAILS_FAIL,
      payload: error.response.data.message,
    });
  }
};


// Update Story --Admin
export const updateStory = (id, storyData) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_STORY_REQUEST });

    const config = {
      headers: { "Content-Type": "application/json" },
    };

    const { data } = await axios.put(
      `/api/v1/admin/product/${id}`,
      storyData,
      config
    );

    dispatch({
      type: UPDATE_STORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: UPDATE_STORY_FAIL,
      payload: error.response.data.message,
    });
  }
};


// Delete Story --Admin
export const deleteStory = (id) => async (dispatch) => {
  try {
    dispatch({ type: DELETE_STORY_REQUEST });

    const { data } = await axios.delete(`/api/v1/admin/story/${id}`);

    dispatch({
      type: DELETE_STORY_SUCCESS,
      payload: data.success,
    });
  } catch (error) {
    dispatch({
      type: DELETE_STORY_FAIL,
      payload: error.response.data.message,
    });
  }
};


// Clearing Errors
export const clearErrors = () => async (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};