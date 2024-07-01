const fs = require("fs");

export function getRandomLine(callback){
    fs.readFile("words.csv", "utf-8", function(err, data){
      if(err) {
          throw err;
      }
      var lines = data.split('\n');
      var line = lines[Math.floor(Math.random()*lines.length)]

      callback(line);
   })
  }