import mongoose from "mongoose";

export const register = () => {
	mongoose
		.connect(process.env.MONGODB_URI as string)
		.then(() => console.log("Connected to MongoDB"));
};
