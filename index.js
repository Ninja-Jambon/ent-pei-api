const express = require("express");
const fs = require("fs");
const path = require("path");
const config = require("./config");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const https = require("https");
require("dotenv").config()

const { sendWebhook } = require("./libs/discordApi");
const { listFutureHomeworks, setShown } = require("./libs/mysql")

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

app.listen(port, async () => {
  console.log(`Server listening on port http://localhost:${port}`);});

const privateKey = fs.readFileSync("./sslcert/privkey.pem", "utf8");
const certificate = fs.readFileSync("./sslcert/fullchain.pem", "utf8");

const credentials = { key: privateKey, cert: certificate };

const httpsServer = https.createServer(credentials, app);

httpsServer.listen(443, () => {
  console.log("https server listening on port 443")
})

setInterval(async () => {
  const data = await listFutureHomeworks();

  data.forEach((homework) => {
    const dueDate = new Date(homework.date).setHours(18, 0, 0, 0);
    const timeDiff = dueDate - Date.now();

    if (timeDiff < 1000 * 60 * 60 * 24 * 3 && homework.shown == 0) {
      sendWebhook(`Travail à faire dans trois jours - ${homework.title}`, homework.description, homework.important);
      setShown(homework.id, 1);
    }
    else if (timeDiff < 1000 * 60 * 60 * 24 && homework.shown == 1) {
      sendWebhook(`Travail à faire dans 1 jour - ${homework.title}`, homework.description, homework.important);
      setShown(homework.id, 2);
    }
  })
}, 1000 * 60)