/*
*
-> title: Notifications library
-> description : Functions for notify users
-> Author : Sagar 
-> Date : 03-4-22 
*
*/

//dependencies
const https = require("https");
const { twilio } = require("./environments");
const queryString = require("querystring");

//module scaffolding
const notifications = {};

//send sms to users using twilio api

notifications.sendTwilioSms = (phone, msg, callBack) => {
  const userPhone =
    typeof phone === "string" && phone.trim().length === 11
      ? phone.trim()
      : false;
  const userMsg =
    typeof msg === "string" &&
    msg.trim().length > 0 &&
    msg.trim().length <= 1600
      ? msg.trim()
      : false;

  if (userPhone && userMsg) {
    const payload = {
      From: twilio.fromPhone,
      To: `+88${userPhone}`,
      Body: userMsg,
    };

    // stringify the payload

    const stringifyPayload = queryString.stringify(payload);

    //configure the request details
    const reqDetailsObject = {
      hostname: "api.twilio.com",
      method: "POST",
      path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
      auth: `${twilio.accountSid}:${twilio.authToken}`,
      headers: {
        "Content-Type": "application/x-www-from-urlencoded",
      },
    };
    const req = https.request(reqDetailsObject, (res) => {
      const status = res.statusCode;

      if (status === 200 || status === 201) {
        callBack(false);
      } else {
        callBack({ status });
      }
    });

    req.on("error", (err) => {
      callBack(err);
    });

    req.write(stringifyPayload);
    req.end();
  } else {
    callBack("Given parameters were missing or invalid");
  }
};

module.exports = notifications;
