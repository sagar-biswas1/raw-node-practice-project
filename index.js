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
const {handleReqRes} =require("./helpers/handleReqRes")

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

app.handleReqRes = handleReqRes;

//start the server

app.createServer();
