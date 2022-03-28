/*
*
-> title: dealing with data
-> description : dealing with data
-> Author : Sagar 
-> Date : 28-3-22 
*
*/

//dependencies

const fs = require("fs");
const path = require("path");

// module scaffolding
const lib = {};

//base directory of the data folder
lib.baseDirectory = path.join(__dirname, "/../.data/");

console.log(" this is dir from data.js ",{__dirname}, lib.baseDirectory);
//write data to file

lib.create = function (dir, file, data, callBack) {
  //open file for writing

  fs.open(
    lib.baseDirectory + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {
      if (!err && fileDescriptor) {
        //convert data to string
        const stringData = JSON.stringify(data);

        //write data to file and then close it
        fs.writeFile(fileDescriptor, stringData, (err) => {
          if (!err) {
            fs.close(fileDescriptor, function (err) {
              if (!err) {
                callBack(false);
              } else {
                callBack("error closing new file");
              }
            });
          } else {
            callBack("Error when writing new file...");
          }
        });
      } else {
        callBack("Could not create new file, it may exists...");
      }
    }
  );
};


module.exports =lib