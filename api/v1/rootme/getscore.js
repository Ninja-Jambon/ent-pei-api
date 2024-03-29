const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { getRootmeUsers } = require("../../../libs/mysql");
const { get_points_from_id } = require("../../../libs/rootme");

const router = express.Router();

router.get("/", async (req, res) => {
  const { token } = req.cookies;

  try {
    _data = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(400).json({ message: "invalid token" });
  }
  var users = await getRootmeUsers();

  users.sort((a, b) => parseInt(b.points) - parseInt(a.points));
  res.status(200).json(users);
});

module.exports = router;
