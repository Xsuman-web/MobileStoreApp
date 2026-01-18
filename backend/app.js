import express from "express";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname } from "path";

import productModel from "./models/product.js";
import homepage from "./routes/index.js";
import upload from "./config/multer.js";
import cloudinary from "./config/cloudinary.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/", homepage);

app.get("/create", (req, res) => res.render("create"));

app.get("/read", async (req, res) => {
  const products = await productModel.find();
  res.render("read", { products });
});

/* ================= CREATE ================= */
app.post("/create", upload.single("image"), async (req, res) => {
  try {
    const { name, description, price, brand } = req.body;

    await productModel.create({
      name,
      description,
      price,
      brand,
      image: {
        url: req.file.path,
        public_id: req.file.filename,
      },
    });

    res.redirect("/create");
  } catch (err) {
    console.error(err);
    res.status(500).send("Create Error");
  }
});

/* ================= EDIT ================= */
app.get("/edit/:productid", async (req, res) => {
  const product = await productModel.findById(req.params.productid);
  res.render("edit", { product });
});

/* ================= UPDATE ================= */
app.post("/update/:id", upload.single("imageFile"), async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    const updateData = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      brand: req.body.brand,
    };

    if (req.file) {
      await cloudinary.uploader.destroy(product.image.public_id);

      updateData.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    await productModel.findByIdAndUpdate(req.params.id, updateData);
    res.redirect("/read");
  } catch (err) {
    console.error(err);
    res.status(500).send("Update Error");
  }
});

/* ================= DELETE ================= */
app.get("/delete/:id", async (req, res) => {
  try {
    const product = await productModel.findById(req.params.id);

    if (product?.image?.public_id) {
      await cloudinary.uploader.destroy(product.image.public_id);
    }

    await productModel.findByIdAndDelete(req.params.id);
    res.redirect("/read");
  } catch (err) {
    console.error(err);
    res.status(500).send("Delete Error");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
