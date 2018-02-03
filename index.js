const express = require('express');
const app=express();
const VoiceResponse=require('twilio').twiml.VoiceResponse;
//const MessagingResponse=require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const client=require('twilio')(
	process.env.BEDHEADS_TWILIO_ACCOUNT_SID,
	process.env.BEDHEADS_TWILIO_AUTH_TOKEN
);

var https=require("https");

app.use(bodyParser.urlencoded({extended: false}));

const port=process.env.PORT;
app.listen(port,()=>{
	console.log('live on port '+port);
});


app.post('/voice',(req,res)=>{
	
	console.log("test phone output");
	//const response=new VoiceResponse();
	//response.say("Listing facilities now.");
	//sendResponse(response,res);
			
});


/*
app.get('/handleMainMenuResponse',(req,res)=>{
	var digits=req.query.Digits;
	const response=new VoiceResponse();
	
	switch(digits){
		case "1":
			response.say("Listing facilities now.");
			break;
		case "2":
			response.say("")
	}
	if (digits=="1"){
		response.say("Listing facilities now.");
	}
	elseif (digits=="2"){
		response.say("You didn't press 1.");
	}
	responseTwiml=response.toString();
	console.log("responseTwiml: "+responseTwiml);
	res.send(responseTwiml);
});
*/

function sendResponse(response,res){
	responseTwiml=response.toString();
	console.log("responseTwiml: "+responseTwiml);
	res.send(responseTwiml);
}

//creates a url from an array of key-value pairs
function buildGetUrl(baseUrl,paramArray){
	url=baseUrl+"?";
	Object.keys(paramArray).forEach(function(key){
		url+=key+"="+encodeURIComponent(paramArray[key])+"&";
	});
	url=url.slice(0,-1);
	return url;
	
}