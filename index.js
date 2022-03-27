/*
*
-> title: Uptime monitoring app 
-> description : A rest api to monitor up or down time of user defined link 
-> Author : Sagar 
-> Date : 27-3-22 
*
*/

// dependencies

const http = require("http");
const url = require("url");
const { StringDecoder } = require("string_decoder");

//app object -> module scaffolding

const app = {
  name: "name",
};

//configuration

app.config = {
  port: 4000,
};

//create server

app.createServer = function () {
  const server = http.createServer(this.handleReqRes);

  server.listen(this.config.port, () =>
    console.log(`server stated at port ${app.config.port}`)
  );
};

//handle request and response

app.handleReqRes = (req, res) => {
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

//start the server

app.createServer();
