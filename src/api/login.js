import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

// set response interceptor to refresh token
api.interceptors.response.use(
  (response) => response, // if response is successful, then return it without processing
  async (error) => {
    // if error, go to this function
    const originalRequest = error.config; // get config info of original request
    if (error.response.status == 401 && !originalRequest._retry) {
      // unauthorized and already tried
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh");
        console.log(refreshToken);
        const response = await api.post("/refresh/", { refresh: refreshToken });
        // set new tokens and header
        setTokens(response.data.access, response.data.refresh);
        originalRequest.headers[
          "Authorization"
        ] = `Bearer ${response.data.access}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Token refresh failed");
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        window.location.href = "/login"; // go back to login window
        return Promise.reject(refreshError); // the promise is rejected because of refresh error
      }
    }
    return Promise.reject(error); // other errors
  }
);

let accessToken = null;
let refreshToken = null;

// set header
function setTokens(access, refresh) {
  accessToken = access;
  refreshToken = refresh;
  api.defaults.headers.common["Authorization"] = "Bearer ${accessToken}";
}

export const login = async (username, password) => {
  try {
    const response = await api.post("/login/", { username, password });
    const { access, refresh } = response.data;
    setTokens(access, refresh); // set tokens
    return response.data;
  } catch (error) {
    console.log("login error", error);
    throw error;
  }
};

export const register = async (registerData) => {
  try {
    const response = await api.post("/register/", {
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
    });
    return response.data;
  } catch (error) {
    console.log("register error");
    throw error;
  }
};

export { setTokens };
