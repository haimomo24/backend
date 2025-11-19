const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  getVisits,
  getVisitById,
  createVisit,
  updateVisit,
  deleteVisit
} = require("../controllers/visitController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "public/uploads/visit"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Routes
router.get("/", getVisits);
router.get("/:id", getVisitById);
router.post("/", upload.fields([{ name: "image_1" }, { name: "image_2" }, { name: "image_3" }]), createVisit);
router.put("/:id", upload.fields([{ name: "image_1" }, { name: "image_2" }, { name: "image_3" }]), updateVisit);
router.delete("/:id", deleteVisit);

module.exports = router;
