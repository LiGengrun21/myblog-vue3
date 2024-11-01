import apiClient from "./axios";

/**
 * get the list of blog posts
 * @param {*} currentPage
 * @param {*} pageSize
 * @returns
 */
export const fetchBlogList = async (currentPage, pageSize) => {
  try {
    const response = await apiClient.get("/posts/", {
      params: {
        page: currentPage,
        pageSize: pageSize,
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * get one blog post
 * @param {*} id
 * @returns
 */
export const fetchBlog = async (id) => {
  try {
    const response = await apiClient.get(`/posts/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * get the list of tags
 * @returns
 */
export const fetchTagList = async () => {
  try {
    const response = await apiClient.get("/tags/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * create a post
 * @param {} postData
 * @returns
 */
export const createPost = async (postData) => {
  try {
    const response = await apiClient.post(
      "/posts/",
      {
        title: postData.title,
        blog_user: postData.userId,
        tags: postData.tagIds,
        content: postData.content,
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

/**
 * react on the post
 * @param {*} reactData
 * @returns
 */
export const reactPost = async (reactData) => {
  try {
    const response = await apiClient.patch(
      "/posts/",
      {
        likes: reactData.likes,
        dislikes: reactData.dislikes,
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
