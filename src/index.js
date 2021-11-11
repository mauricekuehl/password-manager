const express = require("express");
const app = express();
const fs = require("fs");
const crypto = require("crypto");
const { json } = require("express");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
app.use(express.static("static"));
app.use(express.json());

app.get("/api", (req, res) => {
  const key = hash(req.body.auth);
  const path = `database/${key}.json`;
  if (fs.existsSync(path)) {
    fs.readFile(path, (err, data) => {
      res.json(JSON.parse(data));
    });
  } else {
    res.sendStatus(409);
  }
});

app.post("/api/signup", (req, res) => {
  const key = hash(req.body.auth);
  const path = `database/${key}.json`;
  if (fs.existsSync(path)) {
    res.sendStatus(409).send();
    console.log("allready existing");
  } else {
    fs.writeFile(path, JSON.stringify({ key: key }), "utf8", (err, data) => {
      console.error(err, data);
    });
    res.sendStatus(200);
  }
});

app.post("/api", (req, res) => {
  const key = hash(req.body.auth);
  const path = `database/${key}.json`;
  if (fs.existsSync(path)) {
    fs.readFile(path, (err, data) => {
      let fileData = JSON.parse(data);
      fileData[req.body.name] = req.body.content;
      fs.writeFile(path, JSON.stringify(fileData), "utf8", (err, data) => {
        if (err) console.error(err, data);
        res.status(200).send();
      });
    });
  } else {
    res.status(409).send();
  }
});

app.delete("/api", (req, res) => {
  const key = hash(req.body.auth);
  const path = `database/${key}.json`;
  if (fs.existsSync(path)) {
    fs.readFile(path, (err, data) => {
      let fileData = JSON.parse(data);
      delete fileData[req.body.name];
      fs.writeFile(path, JSON.stringify(fileData), "utf8", (err, data) => {
        if (err) console.error(err, data);
        res.status(200).send();
      });
    });
  } else {
    res.status(409).send();
  }
});

function hash(input) {
  return crypto.createHash("sha512").update(`${input}`).digest("hex");
}
