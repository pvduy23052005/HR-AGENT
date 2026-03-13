"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async () => {
    try {
        const url = process.env.MONGODB_URI ?? '';
        await mongoose_1.default.connect(url);
        console.log('Database connected successfully');
    }
    catch (error) {
        console.log('Database connection failed:', error);
    }
};
exports.connectDatabase = connectDatabase;
//# sourceMappingURL=database.js.map