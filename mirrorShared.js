const chokidar = require('chokidar');
const fs = require('fs');
const p = require("path");

// One-liner for current directory
chokidar.watch('./src/shared').on('all', (event, path) => {
  console.log(event, path);
  if(event === "add" || event === "change"){
      console.log("placing in ", "./src/frontend/src/shared" + path.replace("src\\shared", ""));
      fs.copyFile(p.join(__dirname, path), "./src/frontend/src/shared" + path.replace("src\\shared", ""), () => {})
  }
});