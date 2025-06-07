import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: String,
  salary: Number,
  image: String,
  category_id: { type: mongoose.Schema.Types.ObjectId, ref: "Category" }
});

export default mongoose.model("Employee", EmployeeSchema);