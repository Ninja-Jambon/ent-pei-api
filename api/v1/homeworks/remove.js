const express = require('express');
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { removeHomework } = require("../../../libs/mysql");

const router = express.Router();

router.post('/', async (req, res) => {
    const { token } = req.cookies;
    const { id } = req.body;

    try {
        const data = jwt.verify(token, config.jwtSecret);

        if (!config.admins.includes(data.userid)) {
            return res.status(500).json({ message: "you have to be admin to remove an homework" });
        }

        await removeHomework(id);

        res.status(200).json({message: "success"});
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: "invalid token" });
    }
});

module.exports = router;