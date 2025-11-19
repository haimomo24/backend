const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
require("dotenv").config();

const visitRoutes = require("./routes/visitRoutes");
const checkinRoute = require("./routes/checkinRoute");
const serviceRoutes = require("./routes/serviceRoutes");
const newRoutes = require("./routes/newRoutes");
const loginRoutes = require("./routes/loginRoutes");
const contactRoutes = require("./routes/contactRoutes");
const mesRoutes = require("./routes/mesRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

// Tạo folder upload nếu chưa có
const uploadDir = path.join(__dirname, "public/uploads/checkin");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });


// Serve folder public/uploads để truy cập ảnh
app.use("/uploads", express.static(path.join(__dirname, "public/uploads")));

// Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000", // frontend Next.js
  credentials: true
}));
// Lưu ý: không dùng express.json() cho route upload file, Multer sẽ parse FormData

// Routes
app.use("/api/visit", visitRoutes);
app.use("/api/checkin", checkinRoute);
app.use("/api/service", serviceRoutes);
app.use("/api/new", newRoutes);
app.use("/api/login", loginRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/mes", mesRoutes);

// Test server
app.get("/", (req, res) => {
  res.send("Backend TuyetTinCoc MSSQL is running");
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
