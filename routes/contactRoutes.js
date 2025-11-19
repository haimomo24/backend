const express = require("express");
const router = express.Router();
const { submitContact, getContacts, deleteContact } = require("../controllers/contactControler");

router.post("/", submitContact); 
router.get("/", getContacts);    
router.delete("/:id", deleteContact);

module.exports = router;
