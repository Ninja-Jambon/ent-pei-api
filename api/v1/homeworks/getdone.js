const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { getDone } = require("../../../libs/mysql");

const router = express.Router();

router.get("/", async (req, res) => {
  const { token } = req.cookies;

  try {
    const data = jwt.verify(token, config.jwtSecret);

    const done = await getDone(data.userid);

    res.status(200).json(done);
  } catch (e) {
    res.status(400).json({ message: "invalid token" });
  }
});

module.exports = router;
