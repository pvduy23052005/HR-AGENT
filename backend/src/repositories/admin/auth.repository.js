import Account from "../../models/accountAdmin.model.js";

export const findAccountByEmail = async (email) => {
  return await Account.findOne({
    email: email,
    deleted: false,
  });
};
