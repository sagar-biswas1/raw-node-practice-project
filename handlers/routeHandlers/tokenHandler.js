/*
*
-> title: token handler
-> description : A  handler for handling token related routes 
-> Author : Sagar 
-> Date : 29-3-22 
*
*/

//dependencies

const data = require("../../lib/crudFsData");
const {
  hash,
  parseJSON,
  createRandomString,
} = require("../../helpers/utilities");

// module scaffolding

const handler = {};

handler.tokenHandler = (requestProperties, callBack) => {
  const acceptedMethods = ["get", "post", "put", "delete"];

  if (acceptedMethods.indexOf(requestProperties.method) > -1) {
    handler._token[requestProperties.method](requestProperties, callBack);
  } else {
    callBack(405, {
      massage: "not a valid method",
    });
  }
};

handler._token = {};

handler._token.post = (requestProperties, callBack) => {
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

  if (phone && password) {
    data.read("users", phone, (error, userData) => {
      let hashedPassword = hash(password);

      if (hashedPassword === parseJSON(userData).password) {
        let tokenID = createRandomString(20);
        let expires = Date.now() + 60 * 60 * 1000;
        let tokenObj = { phone, tokenID, expires };

        data.create("tokens", tokenID, tokenObj, (err) => {
          if (!err) {
            callBack(200, tokenObj);
          } else {
            callBack(500, {
              error: "there was a problem in server",
            });
          }
        });
      } else {
        callBack(400, {
          error: "password is not valid",
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

handler._token.get = (requestProperties, callBack) => {
  //check the id is valid
  const id =
    typeof requestProperties.queryStringObject.tokenID === "string" &&
    requestProperties.queryStringObject.tokenID.trim().length === 20
      ? requestProperties.queryStringObject.tokenID
      : false;

  if (id) {
    //lookup the user

    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        const token = { ...parseJSON(tokenData) };

        callBack(200, token);
      } else {
        callBack(404, {
          error: "no token found with this query",
          status: 404,
        });
      }
    });
  } else {
    callBack(404, {
      error: "no token found with this query.....",
      status: 404,
    });
  }
};

handler._token.put = (requestProperties, callBack) => {
  const id =
    typeof requestProperties.body.tokenID === "string" &&
    requestProperties.body.tokenID.trim().length === 20
      ? requestProperties.body.tokenID
      : false;

  const extend =
    typeof requestProperties.body.extend === "boolean" &&
    requestProperties.body.extend === true
      ? requestProperties.body.extend
      : false;

  if (id && extend) {
    data.read("tokens", id, (err, tokenData) => {
      let tokenObject = parseJSON(tokenData);
      if (parseJSON(tokenData).expires > Date.now()) {
        tokenObject.expires = Date.now() + 60 * 60 * 1000;

        // store the updated tokenData

        data.update("tokens", id, tokenObject, (err) => {
          if (!err) {
            callBack(200, {
              message: "Sussessfully updated data...",
            });
          } else {
            callBack(400, {
              error: "server side error",
            });
          }
        });
      } else {
        callBack(400, {
          error: "token already expired.....",
        });
      }
    });
  } else {
    callBack(400, {
      error: "there was a problem in your req...",
    });
  }
};
handler._token.delete = (requestProperties, callBack) => {
  // check the token is valid
  const id =
    typeof requestProperties.body.tokenID === "string" &&
    requestProperties.body.tokenID.trim().length === 20
      ? requestProperties.body.tokenID
      : false;

  if (id) {
    data.read("tokens", id, (err, tokenData) => {
      if (!err && tokenData) {
        data.delete("tokens", id, (err) => {
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
    callBack(400, {
      error: "invalid request. try again",
    });
  }

  //
};

handler._token.verify = (id, phone, callBack) => {
  data.read("tokens", id, (err, tokenData) => {
    if (!err) {
      if (
        parseJSON(tokenData).phone === phone &&
        parseJSON(tokenData).expires > Date.now()
      ) {
        callBack(true);
      } else {
        callBack(false);
      }
    } else {
      callBack(false);
    }
  });
};

module.exports = handler;
