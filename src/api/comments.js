import apiClient from "./axios";

/**
 * get root comments of a post
 * @param {*} postId
 * @returns
 */
export const fetchRootComments = async (postId) => {
  try {
    const response = await apiClient.get("/comments/root/", {
      params: {
        postId: postId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * get replies of a comment
 * @param {} parentId
 * @returns
 */
export const fetchCommentReplies = async (parentId) => {
  try {
    const response = await apiClient.get("/comments/replies/", {
      params: {
        parentId: parentId,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * create a new comment
 * @param {*} commentData
 * @returns
 */
export const createComment = async (commentData) => {
  //console.log("commentData: ", commentData);
  try {
    const response = await apiClient.post(
      "/comments/",
      {
        user_comment: commentData.userComment,
        blog_user: commentData.userId,
        blog_post: commentData.postId,
        parent: commentData.parentId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};
