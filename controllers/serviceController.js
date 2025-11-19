const { poolPromise, sql } = require("../db");
const fs = require("fs");
const path = require("path");

// Xóa file nếu tồn tại
const deleteFileIfExists = (fileName) => {
  if (!fileName) return;
  const fullPath = path.join(process.cwd(), "public/uploads/service", fileName);
  if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
};

// GET tất cả checkin
const getService = async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query("SELECT * FROM service");
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET chi tiết checkin
const getServiceById = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const result = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT * FROM service WHERE id=@id");

    if (result.recordset.length === 0) return res.status(404).json({ error: "service not found" });
    res.json(result.recordset[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// POST thêm checkin
const createService = async (req, res) => {
  try {
    const body = req.body || {};
    const files = req.files || {};

    console.log("BODY:", body);
    console.log("FILES:", files);

    const {
      name = "",
      name_en = "",
      title_1 = "",
      title_2 = "",
      title_3 = "",
      title_4 = "",
      title_1_en = "",
      title_2_en = "",
      title_3_en = "",
      title_4_en = ""
    } = body;

    const image_1 = files.image_1 ? files.image_1[0].filename : null;
    const image_2 = files.image_2 ? files.image_2[0].filename : null;
    const image_3 = files.image_3 ? files.image_3[0].filename : null;

    const pool = await poolPromise;
    await pool.request()
      .input("name", sql.NVarChar, name)
      .input("name_en", sql.NVarChar, name_en)
      .input("image_1", sql.NVarChar, image_1)
      .input("image_2", sql.NVarChar, image_2)
      .input("image_3", sql.NVarChar, image_3)
      .input("title_1", sql.NVarChar, title_1)
      .input("title_2", sql.NVarChar, title_2)
      .input("title_3", sql.NVarChar, title_3)
      .input("title_4", sql.NVarChar, title_4)
      .input("title_1_en", sql.NVarChar, title_1_en)
      .input("title_2_en", sql.NVarChar, title_2_en)
      .input("title_3_en", sql.NVarChar, title_3_en)
      .input("title_4_en", sql.NVarChar, title_4_en)
      .query(`INSERT INTO service 
        (name, name_en, image_1, image_2, image_3, title_1, title_2, title_3, title_4, title_1_en, title_2_en, title_3_en, title_4_en) 
        VALUES 
        (@name, @name_en, @image_1, @image_2, @image_3, @title_1, @title_2, @title_3, @title_4, @title_1_en, @title_2_en, @title_3_en, @title_4_en)`);

    res.status(201).json({ message: "service created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// PUT sửa checkin
const updateService = async (req, res) => {
  const { id } = req.params;
  try {
    const body = req.body || {};
    const files = req.files || {};

    const {
      name = "",
      name_en = "",
      title_1 = "",
      title_2 = "",
      title_3 = "",
      title_4 = "",
      title_1_en = "",
      title_2_en = "",
      title_3_en = "",
      title_4_en = ""
    } = body;

    const image_1 = files.image_1 ? files.image_1[0].filename : null;
    const image_2 = files.image_2 ? files.image_2[0].filename : null;
    const image_3 = files.image_3 ? files.image_3[0].filename : null;

    const pool = await poolPromise;
    const old = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT image_1, image_2, image_3 FROM service WHERE id=@id");

    if (old.recordset.length === 0) return res.status(404).json({ error: "service not found" });

    if (image_1) deleteFileIfExists(old.recordset[0].image_1);
    if (image_2) deleteFileIfExists(old.recordset[0].image_2);
    if (image_3) deleteFileIfExists(old.recordset[0].image_3);

    await pool.request()
      .input("id", sql.Int, id)
      .input("name", sql.NVarChar, name)
      .input("name_en", sql.NVarChar, name_en)
      .input("title_1", sql.NVarChar, title_1)
      .input("title_2", sql.NVarChar, title_2)
      .input("title_3", sql.NVarChar, title_3)
      .input("title_4", sql.NVarChar, title_4)
      .input("title_1_en", sql.NVarChar, title_1_en)
      .input("title_2_en", sql.NVarChar, title_2_en)
      .input("title_3_en", sql.NVarChar, title_3_en)
      .input("title_4_en", sql.NVarChar, title_4_en)
      .input("image_1", sql.NVarChar, image_1 || old.recordset[0].image_1)
      .input("image_2", sql.NVarChar, image_2 || old.recordset[0].image_2)
      .input("image_3", sql.NVarChar, image_3 || old.recordset[0].image_3)
      .query(`UPDATE service SET
        name=@name, name_en=@name_en,
        image_1=@image_1, image_2=@image_2, image_3=@image_3,
        title_1=@title_1, title_2=@title_2, title_3=@title_3, title_4=@title_4,
        title_1_en=@title_1_en, title_2_en=@title_2_en, title_3_en=@title_3_en, title_4_en=@title_4_en
        WHERE id=@id`);

    res.json({ message: "service updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// DELETE checkin
const deleteService = async (req, res) => {
  const { id } = req.params;
  try {
    const pool = await poolPromise;
    const old = await pool.request()
      .input("id", sql.Int, id)
      .query("SELECT image_1, image_2, image_3 FROM service WHERE id=@id");

    if (old.recordset.length === 0) return res.status(404).json({ error: "service not found" });

    deleteFileIfExists(old.recordset[0].image_1);
    deleteFileIfExists(old.recordset[0].image_2);
    deleteFileIfExists(old.recordset[0].image_3);

    await pool.request()
      .input("id", sql.Int, id)
      .query("DELETE FROM service WHERE id=@id");

    res.json({ message: "service deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getService, getServiceById, createService, updateService, deleteService };
