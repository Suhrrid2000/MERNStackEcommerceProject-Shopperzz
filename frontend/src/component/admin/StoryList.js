import React, { Fragment, useEffect } from "react";
import { DataGrid } from "@material-ui/data-grid";
import "./productList.css";
import { useSelector, useDispatch } from "react-redux";
import {
  clearErrors,
  getAdminStory,
  deleteStory,
} from "../../actions/storyAction";
import { useAlert } from "react-alert";
import { Button } from "@material-ui/core";
import MetaData from "../layout/MetaData";
import DeleteIcon from "@material-ui/icons/Delete";
import SideBar from "./Sidebar";
import { DELETE_STORY_RESET } from "../../constants/storyConstants";

const StoryList = ({ history }) => {
  const dispatch = useDispatch();

  const alert = useAlert();

  const { error, stories } = useSelector((state) => state.stories);

  const { error: deleteError, isDeleted } = useSelector(
    (state) => state.story
  );

  const deleteStoryHandler = (id) => {
    dispatch(deleteStory(id));
  };

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }

    if (deleteError) {
      alert.error(deleteError);
      dispatch(clearErrors());
    }

    if (isDeleted) {
      alert.success("Story Deleted Successfully");
      history.push("/admin/dashboard");
      dispatch({ type: DELETE_STORY_RESET });
    }

    dispatch(getAdminStory());
  }, [dispatch, alert, error, deleteError, history, isDeleted]);

  const columns = [
    { field: "id", headerName: "Story ID", minWidth: 200, flex: 0.5 },

    {
      field: "name",
      headerName: "Organization Name",
      minWidth: 350,
      flex: 1,
    },
    {
      field: "description",
      headerName: "Story Description",
      type: "number",
      minWidth: 350,
      flex: 0.5,
    },

    {
      field: "actions",
      flex: 0.3,
      headerName: "Actions",
      minWidth: 150,
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Fragment>

            <Button onClick={() => deleteStoryHandler(params.getValue(params.id, "id"))}>      
              <DeleteIcon />
            </Button>
          </Fragment>
        );
      },
    },
  ];

  const rows = [];

  stories &&
    stories.forEach((item) => {
      rows.push({
        id: item._id,
        description: item.description,
        name: item.name,
      });
    });

  return (
    <Fragment>
      <MetaData title={`ALL PRODUCTS - Admin`} />

      <div className="dashboard">
        <SideBar />
        <div className="productListContainer">
          <h1 id="productListHeading">ALL STORIES</h1>

          <DataGrid
            rows={rows}
            columns={columns}
            pageSize={10}
            disableSelectionOnClick
            className="productListTable"
            autoHeight
          />
        </div>
      </div>
    </Fragment>
  );
};

export default StoryList;