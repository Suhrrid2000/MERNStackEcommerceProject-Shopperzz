import {
    NEW_STORY_REQUEST,
    NEW_STORY_SUCCESS,
    NEW_STORY_FAIL,
    NEW_STORY_RESET,
    ALL_STORY_FAIL,
    ALL_STORY_REQUEST,
    ALL_STORY_SUCCESS,
    ADMIN_STORY_REQUEST,
    ADMIN_STORY_SUCCESS,
    ADMIN_STORY_FAIL,
    STORY_DETAILS_REQUEST,
    STORY_DETAILS_SUCCESS,
    STORY_DETAILS_FAIL,
    DELETE_STORY_REQUEST,
    DELETE_STORY_SUCCESS,
    DELETE_STORY_FAIL,
    DELETE_STORY_RESET,
    UPDATE_STORY_REQUEST,
    UPDATE_STORY_SUCCESS,
    UPDATE_STORY_FAIL,
    UPDATE_STORY_RESET,
    CLEAR_ERRORS,
  } from "../constants/storyConstants";
  
  
  export const storiesReducer = (state = { stories: [] }, action) => {
    switch (action.type) {
      case ALL_STORY_REQUEST:
      case ADMIN_STORY_REQUEST:
        return {
          loading: true,
          stories: [],
        };
      case ALL_STORY_SUCCESS:
        return {
          loading: false,
          stories: action.payload.stories,
        };
  
      case ADMIN_STORY_SUCCESS:
        return {
          loading: false,
          stories: action.payload,
        };
      case ALL_STORY_FAIL:
      case ADMIN_STORY_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };


  export const newStoryReducer = (state = { story: {} }, action) => {
    switch (action.type) {
      case NEW_STORY_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case NEW_STORY_SUCCESS:
        return {
          loading: false,
          success: action.payload.success,
          story: action.payload.story,
        };
      case NEW_STORY_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case NEW_STORY_RESET:
        return {
          ...state,
          success: false,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };

  export const storyReducer = (state = {}, action) => {
    switch (action.type) {
      case DELETE_STORY_REQUEST:
      case UPDATE_STORY_REQUEST:
        return {
          ...state,
          loading: true,
        };
      case DELETE_STORY_SUCCESS:
        return {
          ...state,
          loading: false,
          isDeleted: action.payload,
        };
  
      case UPDATE_STORY_SUCCESS:
        return {
          ...state,
          loading: false,
          isUpdated: action.payload,
        };
      case DELETE_STORY_FAIL:
      case UPDATE_STORY_FAIL:
        return {
          ...state,
          loading: false,
          error: action.payload,
        };
      case DELETE_STORY_RESET:
        return {
          ...state,
          isDeleted: false,
        };
      case UPDATE_STORY_RESET:
        return {
          ...state,
          isUpdated: false,
        };
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };

  
  
  export const storyDetailsReducer = (state = { story: {} }, action) => {
    switch (action.type) {
      case STORY_DETAILS_REQUEST:
        return {
          loading: true,
          ...state,
        };
      case STORY_DETAILS_SUCCESS:
        return {
          loading: false,
          story: action.payload,
        };
      case STORY_DETAILS_FAIL:
        return {
          loading: false,
          error: action.payload,
        };
  
      case CLEAR_ERRORS:
        return {
          ...state,
          error: null,
        };
      default:
        return state;
    }
  };