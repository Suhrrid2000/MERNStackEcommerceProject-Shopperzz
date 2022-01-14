const express = require("express");
const { getAllStories, createStory, updateStory, deleteStory, getStoryDetails, getAdminStories } = require("../controllers/storyController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();


router.route("/stories").get(getAllStories);
router
  .route("/admin/stories")
  .get(isAuthenticatedUser, authorizeRoles("admin"), getAdminStories);
router.route("/admin/story/new")
    .post(isAuthenticatedUser, authorizeRoles("admin"), createStory);
router.route("/admin/story/:id")
    .put(isAuthenticatedUser, authorizeRoles("admin"), updateStory)
    .delete(isAuthenticatedUser, authorizeRoles("admin"), deleteStory);

router.route("/story/:id").get(getStoryDetails);

module.exports = router;