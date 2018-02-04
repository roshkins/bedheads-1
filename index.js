const express = require("express");
const app = express();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
//const MessagingResponse=require('twilio').twiml.MessagingResponse;
const bodyParser = require("body-parser");
const client = require("twilio")(
  process.env.BEDHEADS_TWILIO_ACCOUNT_SID,
  process.env.BEDHEADS_TWILIO_AUTH_TOKEN
);

const fetch = require("node-fetch");

var https = require("https");

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("live on port " + port);
});

app.post("/voice", (req, res) => {
  const response = new VoiceResponse();

  url = process.env.BEDHEADS_URL + "handleMainMenuResponse";

  gather = response.gather({
    action: url,
    method: "GET"
  });
  gather.say(
    "Press 1 to enter number of beds, press 2 to list available facilities."
  );
  response.say("We didn't receive input.  Goodbye!");
  sendResponse(response, res);

  //displayBeds(res);
});

function displayBeds() {
  url = "https://bedheads-api.herokuapp.com/api/facilities";
  console.log("in displayBeds, before get");
  https.get(url, api_res => {
    console.log("entering get callback");
    var data = "";
    api_res.on("data", chunk => {
      data += chunk;
    });
    api_res.on("end", () => {
      const response = new VoiceResponse();
      const facilities = JSON.parse(data);
      response.say("Listing facilities now.");
      facilities.forEach(facility => {
        const bedsAvailable = facility.bedsAvailable;
        response.say(`${facility.name} has ${bedsAvailable} beds available.`);
      });
      console.log(response.toString());
      return response;
    });
  });
}

app.get("/validatePin", (req, res) => {
  url = process.env.BEDHEADS_URL + "getBeds";
  gather = response.gather({
    action: url,
    method: "GET"
  });
  gather.say("Enter the number of free behds in your facility.");
});

app.get("/handleMainMenuResponse", (req, res) => {
  var digits = req.query.Digits;
  var response = new VoiceResponse();

  switch (digits) {
    case "1":
      gatherPin = response.gather({
        action: process.env.BEDHEADS_URL + "validatePin",
        method: "GET"
      });
      gatherPin.say("Enter your pihn now.");
      break;
    case "2":
      response = displayBeds(res);
      break;
    default:
      url = process.env.BEDHEADS_URL;
      response.say("You pressed an incorrect key.");
      break;
  }
  sendResponse(response, res);
});

app.get("/getBeds", (req, res) => {
  fetch("");
});

function sendResponse(response, res) {
  responseTwiml = response.toString();
  console.log("responseTwiml: " + responseTwiml);
  res.send(responseTwiml);
}

//creates a url from an array of key-value pairs
function buildGetUrl(baseUrl, paramArray) {
  url = baseUrl + "?";
  Object.keys(paramArray).forEach(function(key) {
    url += key + "=" + encodeURIComponent(paramArray[key]) + "&";
  });
  url = url.slice(0, -1);
  return url;
}
