/*
*
-> title: Routes
-> description : Routes of application
-> Author : Sagar 
-> Date : 27-3-22 
*
*/

//dependencies

const { sampleHandler } = require("./handlers/routeHandlers/sampleHandler");
const { userHandler } = require("./handlers/routeHandlers/userHandler");
const { tokenHandler } = require("./handlers/routeHandlers/tokenHandler");
const { checkHandler } = require("./handlers/routeHandlers/checkHandler");
const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");
const routes = {
  sample: sampleHandler,
  user:userHandler,
  token:tokenHandler,
  check:checkHandler

  
};

module.exports = routes;
