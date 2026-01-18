import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

async function connectDB() {
  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

connectDB();

// Product schema
const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  brand: String,
  image: {
    url: String,
    public_id: String,
  },
});


export default mongoose.model("Product", productSchema);
