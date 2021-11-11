const express = require("express");
const app = express();
const fs = require("fs");
const crypto = require("crypto");

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`listening at port ${PORT}`);
});
app.use(express.static("public"));
app.use(express.json());
