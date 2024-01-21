const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { listFutureHomeworks } = require("../../../libs/mysql");

const router = express.Router();

router.get("/", async (req, res) => {
  const { token } = req.cookies;

  try {
    const _data = jwt.verify(token, config.jwtSecret);
    const homeworks = await listFutureHomeworks();
    res.status(200).json(homeworks);
  } catch (e) {
    res.status(400).json({ message: "invalid token" });
  }
});

module.exports = router;
