/*
*
-> title: environments
-> description : handle things related to environments
-> Author : Sagar 
-> Date : 28-3-22 
*
*/


//module scaffolding
const environments = {};

environments.staging = {
  port: 3000,
  evnName: "staging",
};
environments.production = {
  port: 4000,
  evnName: "production",
};

//determine which env was passed

const currentEnvironment =
  typeof process.env.NODE_ENV === "string" ? process.env.NODE_ENV : "staging";

/* 
  ----  export corresponding env object ----
--> check length of currentEnvironment if get undefined when dynamic accessing.
--> console.log(currentEnvironment.length === "staging".length);
 */
const environmentToExport =
  typeof environments[currentEnvironment] === "object"
    ? environments[currentEnvironment]
    : environments.staging;

//exporting module
module.exports = environmentToExport;
