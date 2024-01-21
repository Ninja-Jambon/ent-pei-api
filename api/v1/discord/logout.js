const express = require('express');
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { removeSession } = require("../../../libs/mysql");

const router = express.Router();

router.get('/', (req, res) => {
    const { token } = req.cookies;

    try {
        const data = jwt.verify(token, config.jwtSecret);
        removeSession(data.userid);

        res.clearCookie("token");
        res.status(200).json({message: "success"});
    }
    catch {
        res.status(400).json({ message: "unauthorized" });
    }
});

module.exports = router;