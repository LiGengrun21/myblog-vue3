import axios from "axios";

// for the operations that require access token, so register and login not included
const apiClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 1000,
});

// request interceptor
apiClient.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem("access");
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config; // config contains all the request info, including params, url, headers, method, and data (while using post and put)
    if (error.response.status == 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        console.log("refresh token is: ", refreshToken);
        const response = await axios.post("http://localhost:8000/refresh/", {
          refresh: refreshToken, // request body of the post method
        });
        const accessToken = response.data.access; // get the new access token from response
        localStorage.setItem("access", accessToken); // store the new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`; // set new access token for request
        return apiClient(originalRequest); // resend the request
      } catch (refreshError) {
        // refresh token also expires
        console.log("refresh token error: ", refreshError);
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // go back to login window
        return Promise.reject(refreshError); // the promise is rejected because of refresh error
      }
    }
    return Promise.reject(error); // the promise is rejected because of other reasons
  }
);

export default apiClient;
