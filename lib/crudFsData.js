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

// console.log(" this is dir from data.js ",{__dirname}, lib.baseDirectory);

//write data to file
lib.create = function (dir, file, data, callBack) {
  
  //open file for writing
  fs.open(
    lib.baseDirectory + dir + "/" + file + ".json",
    "wx",
    function (err, fileDescriptor) {

      // console.log("this is file descriptor", fileDescriptor)
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

// read data from file
lib.read = (dir, file, callBack) => {
  fs.readFile(
    `${lib.baseDirectory + dir}/${file}.json`,
    "utf-8",
    (err, data) => {
      callBack(err, data);
    }
  );
};

//update existing file
lib.update = (dir, file, data, callBack) => {
  //file open for updating
  fs.open(
    lib.baseDirectory + dir + "/" + file + ".json",
    "r+",
    (err, fileDescriptor) => {
      if (!err && fileDescriptor) {
        // convert the data to stringData
        const stringData = JSON.stringify(data);

        //truncate the file
        fs.ftruncate(fileDescriptor, (err) => {
          if (!err) {
            //write to the file and close it
            fs.writeFile(fileDescriptor, stringData, (err) => {
              if (!err) {
                fs.close(fileDescriptor, (err) => {
                  if (!err) {
                    callBack(false);
                  } else {
                    callBack("error while closing file");
                  }
                });
              } else {
                callBack("error writing to file");
              }
            });
          } else {
            console.log("err , while trucating file");
          }
        });
      } else {
        console.log("error in updating file....");
      }
    }
  );
};


//delete existing file
lib.delete=(dir,file,callBack)=>{

//unlink file
  fs.unlink(lib.baseDirectory + dir + "/" + file + ".json",(err)=>{
    if (!err) {
      callBack(false);
    }else{
      callBack("error while deleting file....")
    }
  });
}

module.exports = lib;
