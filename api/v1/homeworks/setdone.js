const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { setHomeworkDone, setHomeworkNotDone } = require("../../../libs/mysql");

const router = express.Router();

router.post("/", (req, res) => {
  const { token } = req.cookies;
  const { id, done } = req.body;

  try {
    const data = jwt.verify(token, config.jwtSecret);

    if (done == "true") {
      setHomeworkDone(id, data.userid);

      res.status(200).json({ message: "success" });
    } else if (done == "false") {
      setHomeworkNotDone(id, data.userid);

      res.status(200).json({ message: "success" });
    } else {
      res.status(400).json({ message: "wrong value for done" });
    }
  } catch (e) {
    res.status(400).json({ message: "invalid token" });
  }
});

module.exports = router;
