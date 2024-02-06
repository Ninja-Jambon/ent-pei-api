const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config()

const app = express();
const port = config.port || 3000;

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

function loadRoutes(folderName) {
  const routesPath = path.join(__dirname, folderName);
  const files = fs.readdirSync(routesPath);
  files.forEach((file) => {
    if (fs.lstatSync(path.join(routesPath, file)).isDirectory()) {
      loadRoutes(`${folderName}/${file}`);
      return;
    }
    const filePath = path.join(routesPath, file);
    const route = require(filePath);
    app.use(`/${folderName}/${file.split(".")[0]}`, route);
  });
}

loadRoutes("api");

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
