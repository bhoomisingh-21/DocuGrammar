import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  googleId: { type: String, required: true, unique: true },
  avatar: { type: String },
}, { timestamps: true }); // This adds createdAt and updatedAt automatically

const User = mongoose.model("User", userSchema);
export default User;