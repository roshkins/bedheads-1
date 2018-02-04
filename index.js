const express = require("express");
const app = express();
const VoiceResponse = require("twilio").twiml.VoiceResponse;
//const MessagingResponse=require('twilio').twiml.MessagingResponse;
const bodyParser = require("body-parser");
const client = require("twilio")(
  process.env.BEDHEADS_TWILIO_ACCOUNT_SID,
  process.env.BEDHEADS_TWILIO_AUTH_TOKEN
);

var https = require("https");

app.use(bodyParser.urlencoded({ extended: false }));

const port = process.env.PORT;
app.listen(port, () => {
  console.log("live on port " + port);
});

app.post("/voice", (req, res) => {
  
  url = "https://bedheads-api.herokuapp.com/api/facilities";
  https.get(url, api_res => {
    console.log("entering get callback");
    var data = "";
    api_res.on("data", chunk => {
      data += chunk;
    });
    api_res.on("end", () => {
      const response = new VoiceResponse();
	  console.log(data);
      const facilities = JSON.parse(data);
      response.say("Listing facilities now.");
      facilities.forEach(facility => {
        const bedsAvailable = facility.bedsAvailable;
        response.say(`${facility.name} has ${bedsAvailable} beds available.`);
      });
      sendResponse(response, res);
    });
  });
  
  //displayBeds(res);
  
});

function displayBeds(res){
	url = "https://bedheads-api.herokuapp.com/api/facilities";
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
		const freebeds = facility.bedsAvailable;
		response.say(`${facility.name} has ${bedsAvailable} beds available.`);
	  });
	  sendResponse(response, res);
	});
  });
	
}





app.get('/handleMainMenuResponse',(req,res)=>{
	var digits=req.query.Digits;
	const response=new VoiceResponse();

	switch(digits){
		case "1":
			gather=response.gather({
				action:url,
				method:'GET'
			});
			gather.say("Enter the number of free beds in your facility.");
			break;
		case "2":
			var data = "";
			api_res.on("data", chunk => {
				data += chunk;
			});
			api_res.on("end", () => {
				const response = new VoiceResponse();
				const facilities = JSON.parse(data);
				facilities.forEach(facility => {
					const freebeds = facility.bedsAvailable;
					response.say(`${facility.name} has ${freebeds} beds available.`);
				});
				sendResponse(response, res);
			});
			break;
		default:
			response.say("You pressed an incorrect key.");
			break;		
	}
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
