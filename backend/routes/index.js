// routes/index.js
import express from "express";
import productModel from "../models/product.js";

const router = express.Router();

const brandLogosRaw = {
  apple:
    "https://images.seeklogo.com/logo-png/15/2/apple-logo-png_seeklogo-158010.png",

  samsung:
    "data:image/png;base64,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",

  vivo: "https://cdn.freebiesupply.com/logos/large/2x/vivo-2-logo-black-and-white.png",

  oppo: "https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/oppo-mobile-logo-icon.png",

  realme:
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Realme-realme-_logo_box-RGB-01_with_out_back_ground.svg/1024px-Realme-realme-_logo_box-RGB-01_with_out_back_ground.svg.png",

  xiaomi:
    "https://seeklogo.com/images/X/xiaomi-logo-6A9A4F9E52-seeklogo.com.png",

  oneplus:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8HrmMi8sbePqOdFFlE2vBAQrBdWNXLKCrKA&s",

  nothing:
    "https://img.clevup.in/436452/Nothing_Logo_White-1747735074337.png?height=200&format=webp",

  google: "https://pngimg.com/uploads/google/google_PNG19635.png",

  motorola: "https://pngimg.com/uploads/motorola/motorola_PNG40.png",
};

// helper: normalize keys (lowercase, remove non-alnum)
const normalizeKey = (str) =>
  (str || "")
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");

// prepare processed map for fast lookup
const processedBrandLogos = {};
Object.entries(brandLogosRaw).forEach(([k, v]) => {
  processedBrandLogos[normalizeKey(k)] = v;
});

function findLogoForBrand(brandName) {
  if (!brandName) return "/images/default-logo.png";
  const key = normalizeKey(brandName);

  // 1) exact normalized match
  if (processedBrandLogos[key]) return processedBrandLogos[key];

  // 2) partial match: some DB brand values may be "Google Pixel"
  for (const bk of Object.keys(processedBrandLogos)) {
    if (bk.includes(key) || key.includes(bk)) return processedBrandLogos[bk];
  }

  // 3) match first token (e.g., "googlepixel" -> "google")
  const firstToken = key.split(/[^a-z0-9]+/)[0];
  for (const bk of Object.keys(processedBrandLogos)) {
    if (bk.includes(firstToken)) return processedBrandLogos[bk];
  }

  // 4) try local file (public/images/<normalized>.png) as fallback (may 404)
  return `/images/${key}.png`;
}

router.get("/", async (req, res) => {
  console.log("HOME ROUTE HIT");

  try {
    const brands = await productModel.aggregate([
      { $group: { _id: "$brand", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    // attach image to each brand
    const brandsWithImages = brands.map((b) => ({
      name: b._id,
      count: b.count,
      image: findLogoForBrand(b._id),
    }));

    res.render("index", { brands: brandsWithImages });
  } catch (err) {
    console.error("HOME ERROR:", err);
    res.status(500).send("Server error");
  }
});

// routes/index.js
router.get("/brand/:brandName", async (req, res) => {
  try {
    const brandName = req.params.brandName;
    const products = await productModel.find({ brand: brandName });
    res.render("brand", { brand: brandName, products });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// nav name pages .ejs ko render karega

router.get("/brands", (req, res) => {
  res.render("brands");
});

// router.get("/product-detail", (req, res) => {
//   res.render("product-detail");
// });

// router.get("/about", (req, res) => {
//   res.render("about");
// });

// router.get("/contact", (req, res) => {
//   res.render("contact");
// });

export default router;
