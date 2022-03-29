/*
*
-> title: utilities
-> description : helper utilities function
-> Author : Sagar 
-> Date : 28-3-22 
*
*/

//dependencies
const crypto = require("crypto");

const environments = require("./environments");

//module scaffolding
const utilities = {};

//passed JSON string to object

utilities.parseJSON = (jsonString) => {
  let output = {};

  try {
    output = JSON.parse(jsonString);
  } catch {
    output = {};
  }

  return output;
};

//hash string
utilities.hash = (str) => {
  if (typeof str === "string" && str.length > 0) {
    let hash = crypto
      .createHmac("sha256", environments.secretKey)
      .update(str)
      .digest("hex");

    return hash;
  } else {
    return false;
  }
};

//exporting module
module.exports = utilities;
