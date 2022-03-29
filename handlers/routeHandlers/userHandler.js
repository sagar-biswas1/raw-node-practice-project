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
const { hash } = require("../../helpers/utilities");

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

handler._users.get = (requestProperties, callBack) => {};
handler._users.put = (requestProperties, callBack) => {};
handler._users.delete = (requestProperties, callBack) => {};

module.exports = handler;
