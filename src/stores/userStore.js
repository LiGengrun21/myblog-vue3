import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  // user is the unique id of the store
  state: () => ({
    userId: JSON.parse(localStorage.getItem("userId")) || null, // userId is initialize from local storage
  }),

  actions: {
    // define a set of actions that operate on userId
    setUserId(id) {
      this.userId = id;
      // store in local storage. If not, once the page is reloaded, userId will be lost because it's stored in memory
      localStorage.setItem("userId", JSON.stringify(id));
    },
    clearUserId() {
      this.userId = null; // clear userId after logout
      localStorage.removeItem("userId");
    },
  },
});
