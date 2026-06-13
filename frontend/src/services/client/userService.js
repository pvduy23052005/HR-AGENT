import API from "./index";

const userService = {
  getInterviewNotificationSubscription: async () => {
    const res = await API.get("/user/interview-notification");
    return res;
  },

  updateInterviewNotificationSubscription: async (subscribed) => {
    const res = await API.patch("/user/interview-notification", { subscribed });
    return res;
  },
};

export default userService;
