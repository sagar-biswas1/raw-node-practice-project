/*
*
-> title: check handler
-> description : A check handler for handling user defined
-> Author : Sagar 
-> Date : 02-4-22 
*
*/

//dependencies

const data = require("../../lib/crudFsData");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

const { maxChecks } = require("../../helpers/environments");

// module scaffolding

const handler = {};

handler.checkHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._check[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405, {
      massage: "not a valid method",
    });
  }
};

handler._check = {};

handler._check.post = (requestProperties, callBack) => {
  // validate input
  let protocol =
    typeof requestProperties.body.protocol === "string" &&
    ["http", "https"].indexOf(requestProperties.body.protocol) > -1
      ? requestProperties.body.protocol
      : false;

  let url =
    typeof requestProperties.body.url === "string" &&
    requestProperties.body.url.trim().length > 0
      ? requestProperties.body.url
      : false;

  let method =
    typeof requestProperties.body.method === "string" &&
    ["get", "post", "put", "delete"].indexOf(
      requestProperties.body.method.trim().toLowerCase()
    ) > -1
      ? requestProperties.body.method.trim()
      : false;

  let successCodes =
    typeof requestProperties.body.successCodes === "object" &&
    requestProperties.body.successCodes instanceof Array
      ? requestProperties.body.successCodes
      : false;

  let timeOutSeconds =
    typeof requestProperties.body.timeOutSeconds === "number" &&
    requestProperties.body.timeOutSeconds % 1 === 0 &&
    requestProperties.body.timeOutSeconds >= 1 &&
    requestProperties.body.timeOutSeconds <= 5
      ? requestProperties.body.timeOutSeconds
      : false;

  if (protocol && method && successCodes && timeOutSeconds && url) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    //lookup the user phone by reading the token
    data.read("tokens", token, (err, tokenData) => {
      if (!err && tokenData) {
        let userPhone = parseJSON(tokenData).phone;

        data.read("users", userPhone, (err, userData) => {
          if (!err && userData) {
            tokenHandler._token.verify(token, userPhone, (isTokenVerified) => {
              if (isTokenVerified) {
                let userObject = parseJSON(userData);
                let userChecks =
                  typeof userObject.checks === "object" &&
                  userObject.checks instanceof Array
                    ? userObject.checks
                    : [];

                if (userChecks.length < maxChecks) {
                  let checkId = createRandomString(20);

                  let checkObject = {
                    id: checkId,
                    userPhone,
                    protocol,
                    url,
                    successCodes,
                    timeOutSeconds,
                    method,
                  };
                  //save the objects

                  data.create("checks", checkId, checkObject, (err) => {
                    if (!err) {
                      // add check id to the user's object
                      userObject.checks = userChecks;
                      userObject.checks.push(checkId);

                      //save the new user data

                      data.update("users", userPhone, userObject, (err) => {
                        if (!err) {
                          callBack(200, {
                            checkObject,
                          });
                        } else {
                          callBack(500, {
                            message: "server side error...",
                          });
                        }
                      });
                    } else {
                      callBack(500, {
                        message: "problem in server side...",
                      });
                    }
                  });
                } else {
                  callBack(401, {
                    message: "You have already reached max check limit...",
                  });
                }
              } else {
                callBack(403, {
                  message: "Authentication problem",
                });
              }
            });
          } else {
            callBack(403, {
              message: "User not found",
            });
          }
        });
      } else {
        callBack(403, {
          message: "Auth problem",
        });
      }
    });
  } else {
    callBack(400, {
      message: "You have a problem in your request...",
    });
  }
};

handler._check.get = (requestProperties, callBack) => {};

handler._check.put = (requestProperties, callBack) => {};

handler._check.delete = (requestProperties, callBack) => {};

module.exports = handler;
