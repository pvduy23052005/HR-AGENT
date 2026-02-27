import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./src/models/user.model.js";
import AccountAdmin from "./src/models/accountAdmin.model.js";
import dotenv from "dotenv";

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || "");
    console.log("Database connected successfully");

    // Không xóa dữ liệu cũ nữa
    console.log("Đang thêm/cập nhật dữ liệu...");

    // Hash password trước khi lưu
    const hashedPassword = await bcrypt.hash("123456", 10);
    const hashedAdminPassword = await bcrypt.hash("admin123", 10);
    const hashedHrPassword = await bcrypt.hash("hr123", 10);

    // Thêm user demo
    const users = [
      {
        fullName: "Phạm Văn Hùng",
        email: "pvhtx22@gmail.com",
        password: "123456",
        avatar: "",
        status: "active",
        deleted: false,
      },
      {
        fullName: "Trần Thị B",
        email: "tranthib@gmail.com",
        password: hashedPassword,
        avatar: "",
        status: "active",
        deleted: false,
      },
      {
        fullName: "Lê Hoàng C",
        email: "lehoangc@gmail.com",
        password: hashedPassword,
        avatar: "",
        status: "active",
        deleted: false,
      },
    ];

    // Thêm admin demo
    const admins = [
      {
        fullName: "Admin Hệ Thống",
        email: "admin@hragent.com",
        password: hashedAdminPassword,
        role_id: "admin",
        status: "active",
        avatar: "",
        deleted: false,
      },
      {
        fullName: "HR Manager",
        email: "hr@hragent.com",
        password: hashedHrPassword,
        role_id: "hr",
        status: "active",
        avatar: "",
        deleted: false,
      },
    ];

    // Insert users
    const insertedUsers = await User.insertMany(users, { ordered: false }).catch(
      (err) => {
        if (err.code === 11000) {
          console.log("❌ User already exists (duplicate email)");
          return [];
        }
        throw err;
      }
    );

    // Insert admins
    const insertedAdmins = await AccountAdmin.insertMany(admins, {
      ordered: false,
    }).catch((err) => {
      if (err.code === 11000) {
        console.log("❌ Admin already exists (duplicate email)");
        return [];
      }
      throw err;
    });

    console.log("✅ Seed completed!");
    console.log(`✓ Inserted ${insertedUsers.length} users`);
    console.log(`✓ Inserted ${insertedAdmins.length} admins`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seed failed:", error.message);
    process.exit(1);
  }
};

seedDatabase();
