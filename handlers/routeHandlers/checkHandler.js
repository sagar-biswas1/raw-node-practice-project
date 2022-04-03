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

handler._check.get = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //lookup the check
    // console.log(id);
    data.read("checks", id, (err, checkData) => {
      let parsedCheckData = { ...parseJSON(checkData) };

      if (!err && checkData) {
        let token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parsedCheckData.userPhone,
          (tokenId) => {
            if (tokenId) {
              callBack(200, {
                parsedCheckData,
              });
            } else {
              callBack(400, {
                message: "Auth error",
              });
            }
          }
        );
      } else {
        callBack(400, {
          message: "You have a problem in your request......",
        });
      }
    });
  } else {
    callBack(400, {
      message: "You have a problem in your request...",
    });
  }
};

handler._check.put = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.body.id === "string" &&
    requestProperties.body.id.trim().length === 20
      ? requestProperties.body.id
      : false;

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

  if (id) {
    if (protocol || utl || method || successCodes || timeOutSeconds) {
      data.read("checks", id, (err, checkData) => {
        if (!err && checkData) {
          let checkObject = { ...parseJSON(checkData) };
          let token =
            typeof requestProperties.headerObject.token === "string"
              ? requestProperties.headerObject.token
              : false;
          tokenHandler._token.verify(
            token,
            checkObject.userPhone,
            (isVerified) => {
              if (isVerified) {
                if (protocol) {
                  checkObject.protocol = protocol;
                }
                if (url) {
                  checkObject.url = url;
                }
                if (method) {
                  checkObject.method = method;
                }
                if (successCodes) {
                  checkObject.successCodes = successCodes;
                }
                if (timeOutSeconds) {
                  checkObject.timeOutSeconds = timeOutSeconds;
                }

                data.update("checks", id, checkObject, (err) => {
                  if (!err) {
                    callBack(200, {
                      message: "updated successfully",
                    });
                  } else {
                    callBack(500, {
                      message: "Server side error",
                    });
                  }
                });
              } else {
                callBack(403, {
                  message: "Auth error....",
                });
              }
            }
          );
        } else {
          callBack(500, {
            message: "Error in server side...",
          });
        }
      });
    } else {
      callBack(400, {
        message: "You should provide at least one field to update...",
      });
    }
  } else {
    callBack(400, {
      message: "You have a problem in your request...",
    });
  }
};

handler._check.delete = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.queryStringObject.id === "string" &&
    requestProperties.queryStringObject.id.trim().length === 20
      ? requestProperties.queryStringObject.id
      : false;

  if (id) {
    //lookup the check
    // console.log(id);
    data.read("checks", id, (err, checkData) => {
      let parsedCheckData = { ...parseJSON(checkData) };

      if (!err && checkData) {
        let token =
          typeof requestProperties.headerObject.token === "string"
            ? requestProperties.headerObject.token
            : false;

        tokenHandler._token.verify(
          token,
          parsedCheckData.userPhone,
          (tokenId) => {
            if (tokenId) {
              //delete the check data
              data.delete("checks", id, (err) => {
                if (!err) {
                  data.read(
                    "users",
                    parsedCheckData.userPhone,
                    (err, userData) => {
                      let userObject = parseJSON(userData);

                      if (!err && userData) {
                        let userChecks =
                          typeof userObject.checks === "object" &&
                          userObject.checks instanceof Array
                            ? userObject.checks
                            : [];

                        //remove the deleted check id from the user's list of checks

                        let checkPosition = userChecks.indexOf(id);

                        if (checkPosition > -1) {
                          userChecks.splice(checkPosition, 1);
                          userObject.checks = userChecks;
                          data.update(
                            "users",
                            userObject.phone,
                            userObject,
                            (err) => {
                              if (!err) {
                                callBack(200, {
                                  message: "deleted successfully",
                                });
                              } else {
                                callBack(500, {
                                  message: "The id you are trying to remove is not present in the checks array...",
                                });
                              }
                            }
                          );
                        } else {
                          callBack(500, {
                            message: "server side error",
                          });
                        }
                      } else {
                        callBack(500, {
                          message: "server side error",
                        });
                      }
                    }
                  );
                } else {
                  callBack(500, {
                    message: "server side error...",
                  });
                }
              });
            } else {
              callBack(400, {
                message: "Auth error",
              });
            }
          }
        );
      } else {
        callBack(400, {
          message: "You have a problem in your request......",
        });
      }
    });
  } else {
    callBack(400, {
      message: "You have a problem in your request...",
    });
  }
};

module.exports = handler;
