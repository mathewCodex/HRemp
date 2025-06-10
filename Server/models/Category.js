import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Prevent OverwriteModelError by checking if model already exists
export default mongoose.models.Category || mongoose.model("Category", categorySchema);