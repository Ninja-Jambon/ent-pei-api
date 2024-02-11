const axios = require("axios");
const url = require("url");
const config = require("../config.json");

async function getToken(code) {
  const formData = new url.URLSearchParams({
    client_id: process.env.ClientId,
    client_secret: process.env.ClientSecret,
    grant_type: "authorization_code",
    code: code.toString(),
    redirect_uri: config.redirectUri,
  });

  const output = await axios.post(
    "https://discord.com/api/v10/oauth2/token",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  return output.data;
}

async function getNewToken(refresh_token) {
  const formData = new url.URLSearchParams({
    client_id: process.env.ClientId,
    client_secret: process.env.ClientSecret,
    grant_type: "refresh_token",
    refresh_token: refresh_token.toString(),
  });

  const output = await axios.post(
    "https://discord.com/api/v10/oauth2/token",
    formData,
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return output.data;
}

async function getUserInfo(token) {
  const user = await axios.get("https://discord.com/api/v10/users/@me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return user.data;
}

async function sendWebhook(title, description, important) {
  const res = await axios.post(config.webhook, {
    content: "<@1149249993274826802>",
    username: "Roberto",
    avatar_url: "https://cdn.discordapp.com/avatars/1155429463081885717/2ce8204c6af800f39f52655ff6745b86.png",
    embeds: [
      {
        title: title,
        description: description,
        color: important ? 15356477 : 7195103
      }
    ]
  })

  return res;
}

module.exports = {
  getToken,
  getNewToken,
  getUserInfo,
  sendWebhook
};
