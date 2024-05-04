const express = require("express");
const router = express.Router();

router.use("/login", require("./login"));
router.use("/register", require("./register"));
router.use("/lists", require("./lists"));
router.use("/items", require("./items"));

module.exports = router;
