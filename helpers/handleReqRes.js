/*
*
-> title: handle req res
-> description :   handle req res
-> Author : Sagar 
-> Date : 27-3-22 
*
*/

//dependencies
const url = require("url");
const { StringDecoder } = require("string_decoder");
const routes = require("../routes");
const {
  notFoundHandler,
} = require("../handlers/routeHandlers/notFoundHandler");

const { parseJSON } = require("../helpers/utilities");
// module scaffolding
const handler = {};

handler.handleReqRes = (req, res) => {

  // request handle
  //get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headerObject = req.headers;

  const requestProperties = {
    parseUrl,
    path,
    trimmedPath,
    method,
    queryStringObject,
    headerObject,
  };

  // decoding buffered data got from payload
  const decoder = new StringDecoder("utf-8");
  let realData = "";

  const chosenHandler = routes[trimmedPath]
    ? routes[trimmedPath]
    : notFoundHandler;

  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    // console.log('this is realdata from handlereqres file', realData)
    requestProperties.body = parseJSON(realData);
    chosenHandler(requestProperties, (statusCode, payload) => {
      statusCode = typeof statusCode == "number" ? statusCode : 500;

      payload = typeof payload === "object" ? payload : {};

      const payloadString = JSON.stringify(payload);

      res.setHeader('Content-Type','application/json')
      res.writeHead(statusCode);

      res.end(payloadString);
    });
    // res.end(" hey ! how are you buddy? ");
  });
};

module.exports = handler;
