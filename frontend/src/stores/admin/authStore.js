export const authStore = {
  getAdmin: () => {
    const admin = localStorage.getItem("admin");

    if (!admin) return null;

    try {
      return JSON.parse(admin);
    } catch (error) {
      console.log(error);
      return null;
    }
  },

  set: (dataAdmin) => {
    localStorage.setItem("admin", JSON.stringify(dataAdmin));
  },

  clear: () => {
    localStorage.removeItem("admin");
  },
};
