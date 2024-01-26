const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { addHomework } = require("../../../libs/mysql");

const router = express.Router();

router.post("/", async (req, res) => {
  const { token } = req.cookies;
  const { title, description, date, important } = req.body;

  try {
    const data = jwt.verify(token, config.jwtSecret);

    if (!config.admins.includes(data.userid)) {
      return res
        .status(500)
        .json({ message: "you have to be admin to add an homework" });
    }

    if (title.length > 50) {
      return res.status(400).json({ message: "title exceed limit" });
    }

    if (date < Date.now()) {
      return res
        .status(400)
        .json({ message: "you can't add an homework in the past" });
    }

    if (important != "true" && important != "false") {
      return res
        .status(400)
        .json({ message: 'important should be "true" or "false"' });
    }

    await addHomework(title, description, date, important);
  } catch (e) {
    res.status(400).json({ message: "invalid token" });
  }

  res.status(200).json({ message: "success" });
});

module.exports = router;
