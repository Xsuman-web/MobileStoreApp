import express from "express";
import path from "path";
import dotenv from "dotenv";
import multer from "multer";
import { fileURLToPath } from "url";
import { dirname } from "path";
import productModel from "./models/product.js";
import homepage from "./routes/index.js";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();
const app = express();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "public/images"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views")); // 👈 FIX
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Routes
// app.get("/", (req, res) => {
//   res.render("homepage");
// });

app.use("/", homepage);

app.get("/create", (req, res) => {
  res.render("create");
});

app.get("/read", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("read", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.get("/brand", async (req, res) => {
  try {
    const products = await productModel.find();
    res.render("brand", { products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

app.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;
    const imageFilename = req.file.filename; // just the filename

    await productModel.create({
      name,
      description,
      price,
      brand,
      image: imageFilename, // store filename only
    });

    res.redirect("/create");
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).send("Error uploading product");
  }
});

app.get("/edit/:productid", async (req, res) => {
  const product = await productModel.findById(req.params.productid);
  res.render("edit", { product });
});

app.post("/update/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;

    // 1️⃣ get old product
    const product = await productModel.findById(req.params.id);

    const updateData = {
      name,
      description,
      price,
      brand,
    };

    // 2️⃣ if new image uploaded
    if (req.file) {
      // old image path
      const oldImagePath = path.join(__dirname, "public/images", product.image);

      // 3️⃣ delete old image if exists
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // 4️⃣ save new image filename
      updateData.image = req.file.filename;
    }

    // 5️⃣ update product
    await productModel.findByIdAndUpdate(req.params.id, updateData);

    res.redirect("/read");
  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).send("Server Error");
  }
});

app.get("/delete/:id", async (req, res) => {
  try {
    // 1️⃣ product find karo
    const product = await productModel.findById(req.params.id);

    if (!product) {
      return res.redirect("/read");
    }

    // 2️⃣ image ka full path banao
    const imagePath = path.join(__dirname, "public/images", product.image);

    // 3️⃣ image delete karo (agar exist karti hai)
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    // 4️⃣ product delete karo
    await productModel.findByIdAndDelete(req.params.id);

    res.redirect("/read");
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).send("Server Error");
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
