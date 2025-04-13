import mongoose from "mongoose";

const DocumentsSchema = new mongoose.Schema(
	{
		name: String,
		url: String,
		type: String,
		description: String,
		date: Date,
		userId: { type: mongoose.Types.ObjectId, ref: "User" },
	},
	{ timestamps: true },
);
export const Documents =
	mongoose.models.Documents || mongoose.model("Documents", DocumentsSchema);
