const express = require("express");
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { getUser, updateSession } = require("../../../libs/mysql.js");
const { getNewToken, getUserInfo } = require("../../../libs/discordApi.js")

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { token } = req.cookies;
    const data = jwt.verify(token, config.jwtSecret);
    const user = await getUser(data.userid);

    var access_token = user[0].access_token;

    if (user[0].expiry < Date.now()) {
        output = await getNewToken(user[0].refresh_token);
        await updateSession(user[0].userid, output.access_token, Date.now() + output.expires_in * 1000, output.refresh_token);
        access_token = output.access_token;
    }

    const userInfo = await getUserInfo(access_token);
    
    res.status(200).json(userInfo);
  } catch (e) {
    res.status(400).json({ message: "unauthorized" });
  }
});

module.exports = router;
