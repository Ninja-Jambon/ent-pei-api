const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { getToken, getUserInfo } = require("../../../libs/discordApi.js");
const {
  addSession,
  updateSession,
  getUser,
} = require("../../../libs/mysql.js");

const router = express.Router();

router.get("/", async (req, res) => {
  const { code } = req.query;

  if (code) {
    try {
      const output = await getToken(code);
      const user = await getUserInfo(output.access_token);

      const session = await getUser(user.id);

      if (session[0]) {
        updateSession(
          user.id,
          output.access_token,
          Date.now() + 1000 * output.expires_in,
          output.refresh_token
        );
      } else {
        await addSession(
          user.id,
          output.access_token,
          Date.now() + 1000 * output.expires_in,
          output.refresh_token
        );
      }

      token = jwt.sign({ userid: user.id }, config.jwtSecret);
      res.cookie("token", token, { maxAge: 1000 * 60 * 60 * 24 * 31 });
      res.redirect(config.baseUrl);
    } catch (e) {
      console.log(e);
      res.status(400).json({ message: "unauthorized" });
    }
  } else {
    res.status(400).json({ message: "unauthorized" });
  }
});

module.exports = router;
