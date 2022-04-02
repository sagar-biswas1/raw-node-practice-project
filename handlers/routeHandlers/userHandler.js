/*
*
-> title: user handler
-> description : A user handler for handling user related routes 
-> Author : Sagar 
-> Date : 29-3-22 
*
*/

//dependencies

const data = require("../../lib/crudFsData");
const { hash, parseJSON } = require("../../helpers/utilities");
const tokenHandler = require("./tokenHandler");

// module scaffolding

const handler = {};

handler.userHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._users[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405, {
      massage: "not a valid method",
    });
  }
};

handler._users = {};

handler._users.post = (requestProperties, callBack) => {
  // console.log(requestProperties)
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  const tosAgreement =
    typeof requestProperties.body.tosAgreement === "boolean"
      ? requestProperties.body.tosAgreement
      : false;

  if (firstName && lastName && password && phone && tosAgreement) {
    // make sure that user does not already exist
    data.read("users", phone, (err, user) => {
      if (err) {
        let userObj = {
          firstName,
          lastName,
          phone,
          password: hash(password),
          tosAgreement,
        };

        //store the user to db
        data.create("users", phone, userObj, (err) => {
          if (!err) {
            callBack(200, {
              message: "user has been created successfully",
            });
          } else {
            callBack(500, {
              error: "Could not crete users",
            });
          }
        });
      } else {
        callBack(500, {
          error: "there was a problem in server side",
        });
      }
    });
  } else {
    callBack(400, {
      error: "You have a problem in you request",
      status: 400,
    });
  }
};

handler._users.get = (requestProperties, callBack) => {
  //check the phone number is valid
  const phone =
    typeof requestProperties.queryStringObject.phone === "string" &&
    requestProperties.queryStringObject.phone.trim().length === 11
      ? requestProperties.queryStringObject.phone
      : false;

  if (phone) {
    // authentication using token
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        //lookup the user

        data.read("users", phone, (err, user) => {
          if (!err && user) {
            const foundedUser = { ...parseJSON(user) };
            delete foundedUser.password;

            callBack(200, foundedUser);
          } else {
            callBack(404, {
              error: "no user found with this query",
              status: 404,
            });
          }
        });
      } else {
        callBack(403, {
          error: "Authentication failure...",
        });
      }
    });
  } else {
    callBack(404, {
      error: "no user found with this query",
      status: 404,
    });
  }
};

handler._users.put = (requestProperties, callBack) => {
  const firstName =
    typeof requestProperties.body.firstName === "string" &&
    requestProperties.body.firstName.trim().length > 0
      ? requestProperties.body.firstName
      : false;
  const lastName =
    typeof requestProperties.body.lastName === "string" &&
    requestProperties.body.lastName.trim().length > 0
      ? requestProperties.body.lastName
      : false;
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  const password =
    typeof requestProperties.body.password === "string" &&
    requestProperties.body.password.trim().length > 0
      ? requestProperties.body.password
      : false;

  if (phone) {
    // authentication of users"
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        if (firstName || lastName || password) {
          //lookup user
          data.read("users", phone, (err, uData) => {
            const userData = { ...parseJSON(uData) };

            if (!err && userData) {
              if (firstName) {
                userData.firstName = firstName;
              }
              if (lastName) {
                userData.lastName = lastName;
              }
              if (password) {
                userData.password = hash(password);
              }

              //store to db

              data.update("users", phone, userData, (err) => {
                if (!err) {
                  callBack(200, {
                    message: "user has been updated successfully...",
                  });
                } else {
                  callBack(500, {
                    error: "there was an error in serverside",
                  });
                }
              });
            } else {
              callBack(400, {
                error: "you have problem in you request...",
              });
            }
          });
        } else {
          callBack(400, {
            error: "you have problem in you request...",
          });
        }
      } else {
        callBack(403, {
          error: "Authentication failure...",
        });
      }
    });
  } else {
    callBack(400, {
      error: "invalid phone number. try again",
    });
  }
};

handler._users.delete = (requestProperties, callBack) => {
  const phone =
    typeof requestProperties.body.phone === "string" &&
    requestProperties.body.phone.trim().length === 11
      ? requestProperties.body.phone
      : false;

  if (phone) {
    let token =
      typeof requestProperties.headerObject.token === "string"
        ? requestProperties.headerObject.token
        : false;

    tokenHandler._token.verify(token, phone, (tokenId) => {
      if (tokenId) {
        data.read("users", phone, (err, user) => {
          if (!err && user) {
            data.delete("users", phone, (err) => {
              if (!err) {
                callBack(200, {
                  message: "successfully deleted user",
                });
              } else {
                callBack(500, {
                  error: "server site error...",
                });
              }
            });
          } else {
            callBack(500, {
              error: "server site error...",
            });
          }
        });
      } else {
        callBack(403, {
          error: "Authentication failure...",
        });
      }
    });
  } else {
    callBack(400, {
      error: "invalid request. try again",
    });
  }
};

module.exports = handler;
