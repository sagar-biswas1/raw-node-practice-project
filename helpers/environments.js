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
  secretKey:'sdasdasdasdasda',
  maxChecks:5
};
environments.production = {
  port: 4000,
  evnName: "production",
  secretKey: "sklgjsdlfgjsdkl",
  maxChecks:5
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
