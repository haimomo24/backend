const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const {
 getNew,
  getNewById,
 createNew,
  updateNew,
  deleteNew
} = require("../controllers/newController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "public/uploads/new";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getNew);
router.get("/:id", getNewById);

// Dùng Multer để parse FormData (text + file)
router.post(
  "/",
  upload.fields([
    { name: "image_1" },
    { name: "image_2" },
    { name: "image_3" },
  ]),
  createNew
);

router.put(
  "/:id",
  upload.fields([
    { name: "image_1" },
    { name: "image_2" },
    { name: "image_3" },
  ]),
 updateNew
);

router.delete("/:id", deleteNew);

module.exports = router;
