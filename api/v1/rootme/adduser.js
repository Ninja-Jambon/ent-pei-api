const express = require('express');
const jwt = require("jsonwebtoken");

const config = require("../../../config.json");

const { get_id_from_url } = require("../../../libs/rootme")
const { addRootmeUser } = require("../../../libs/mysql")

const router = express.Router();

router.post('/', async (req, res) => {
    const { name, url } = req.body;
    const { token } = req.cookies;

    try {
        const data = jwt.verify(token, config.jwtSecret)

        if (!config.baseUrl.includes(data.userid)) {
            return res.status(400).json({ message: "you need to be an admin" });
        }
    }
    catch {
        return res.status(400).json({ message: "invalid token" });
    }

    if (!name) {
        return res.status(400).json({message: "the name is not present"});
    }

    if (!url) {
        return res.status(400).json({message: "the url is not present"});
    }

    try {
        const id = await get_id_from_url(url);
        const usernameLong = url.split("www.root-me.org/")[1].split("/")[0];
        const username = usernameLong.includes(`-${id}`) ? usernameLong.split("-")[usernameLong.split("-").length - 2] : usernameLong;
        await addRootmeUser(id, name, username, url);

        res.status(200).json({message: "success"});
    }
    catch (e) {
        console.log(e)
        return res.status(400).json({message: "invalid url"});
    }
});

module.exports = router;