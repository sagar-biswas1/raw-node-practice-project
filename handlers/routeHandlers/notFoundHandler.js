/*
*
-> title: not found handler
-> description : A handler for not found route
-> Author : Sagar 
-> Date : 27-3-22 
*
*/

// module scaffolding

const handler = {};

handler.notFoundHandler = (requestProperties, callBack) => {
      callBack(404, {
        massage: "Not found. ",
      });
  console.log("this is error handler");
};

module.exports = handler;
