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
const data = require("./lib/data")


// testing scaffolding
data.create('test','newFile', {name:"sagar", class:9},(err)=>{

  console.log('error was', err)

})

data.read('test','newFile',(err,data)=>{
  console.log(err,data)
})


data.update("test", "newFile", { name: "oshan.............", class:29 }, (err) => {
  console.log("error was", err);
});

data.delete("test", "newFile", (err, data) => {
  console.log(err, data);
});
//end


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
