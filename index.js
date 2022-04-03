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
const { handleReqRes } = require("./helpers/handleReqRes");
const environment = require("./helpers/environments");
const {sendTwilioSms} = require("./helpers/notifications");
const data = require("./lib/crudFsData")

//
// sendTwilioSms('12312312312','sdasdasdas',(err)=>{
//   console.log(err)
// })
//



//app object -> module scaffolding
const app = {};

//configuration
// app.config = {
//   port: 4000,
// };

//create server
app.createServer = function () {
  const server = http.createServer(this.handleReqRes);

  server.listen(environment.port, () =>
    console.log(`server stated at port ${environment.port}`)
  );
};

//handle request and response
app.handleReqRes = handleReqRes;

//start the server
app.createServer();
