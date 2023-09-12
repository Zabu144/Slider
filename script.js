const { google } = require("googleapis");
const express = require("express");
const app = express();
const port = 3000;
const fileList = [];

const privatekey = require("./sliderproject-398111-54bcc9b7ec0d.json");

async function main() {
  const jwtClient = new google.auth.JWT(
    privatekey.client_email,
    null,
    privatekey.private_key,
    ["https://www.googleapis.com/auth/drive"]
  );

  try {
    await authorizeJWT(jwtClient);

    const drive = google.drive({ version: "v3", auth: jwtClient });

    const res = await drive.files.list({
      q: "'" + "1f6riyd80tqobA9s2lvU9uHg9t4htZGeB" + "' in parents and trashed=false",
      fields: "files(name, webContentLink)",
    });

    fileList.push(...res.data.files);

    app.get("/", (req, res) => {
      res.sendFile(__dirname + "/index.html");
    });

    app.get("/imagens", (req, res) => {
      res.json(fileList);
    });

    app.listen(port, () => {
      console.log(`Servidor Express em execução em http://localhost:${3000}`);
    });
  } catch (err) {
    console.error(err);
  }
}

async function authorizeJWT(jwtClient) {
  return new Promise((resolve, reject) => {
    jwtClient.authorize((err, tokens) => {
      if (err) {
        reject(err);
      } else {
        resolve(tokens);
      }
    });
  });
}

main();
