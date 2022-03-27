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

// module scaffolding 

const handler = {}

handler.handleReqRes = (req, res) => {
  // request handle
  //get the url and parse it
  const parseUrl = url.parse(req.url, true);
  const path = parseUrl.pathname;
  const trimmedPath = path.replace(/^\/+|\/+$/g, "");
  const method = req.method.toLowerCase();
  const queryStringObject = parseUrl.query;
  const headerObject = req.headers;

  // decoding buffered data got from payload
  const decoder = new StringDecoder("utf-8");
  let realData = "";
  req.on("data", (buffer) => {
    realData += decoder.write(buffer);
  });

  req.on("end", () => {
    realData += decoder.end();

    res.end(" hey ! how are you buddy? ");
  });
};


module.exports = handler 
