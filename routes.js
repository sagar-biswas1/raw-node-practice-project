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
const { notFoundHandler } = require("./handlers/routeHandlers/notFoundHandler");
const routes = {
  sample: sampleHandler,
  
};

module.exports = routes;
