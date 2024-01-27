const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { getRootmeUsers, updateRootmePoints } = require("../../../libs/mysql");
const { get_points_from_id } = require("../../../libs/rootme");

const router = express.Router();

router.get("/", async (req, res) => {
  const { token } = req.cookies;

  try {
    _data = jwt.verify(token, config.jwtSecret);
  } catch {
    return res.status(400).json({ message: "invalid token" });
  }

  const users = await getRootmeUsers();

  for (var i = 0; i < users.length; i++) {
    const points = await get_points_from_id(users[i].userid);

    updateRootmePoints(users[i].userid, points);
  }

  res.status(200).json({message: "success"});
});

module.exports = router;
