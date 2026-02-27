import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const test = async () => {
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("DB NAME:", mongoose.connection.name);

    const users = await mongoose.connection.db.collection("users").find({}).toArray();
    console.log("TOTAL USERS:", users.length);
    users.forEach(u => console.log("-", u.email, "|", u.password));

    process.exit(0);
};
test();
