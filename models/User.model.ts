import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
	college: String,
	course: String,
	branch: String,
	name: String,
	class: String,
	serial: Number,
	faculty: String,
	enrollment: String,
	hall: String,
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
