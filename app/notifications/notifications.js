'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	config = require('../../config/config'),
    gcm = require('node-gcm');
    
    

exports.pushNotification = function(req, res){
	
	var message = new gcm.Message();
	
	message.addData('message', 'xyx');
	message.addData('title','New song created' );
	message.addData('msgcnt','2'); // Shows up in the notification in the status bar
	message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
	message.collapseKey = 'demo';
	message.delayWhileIdle = true; //Default is false
	
	
	//Replace your mobile device registration Id here
	var regIds = ['APA91bERKYnplW6EPtsO9YeI_dN08i2CrKElGwXXP4D8eSlvXti1_jp4zD5surCTkPsMKwy7Nj8lplt5Pfdl1PHSO2vzQbGp7v9L9ZQvSxOKepoMVFWrlc0jXHePYsVyq4QnkmRJ3OzcHAYc2fzlYpJzXCeAF7d8GQ'];
	//Replace your developer API key with GCM enabled here
	var sender = new gcm.Sender(config.gcm_server_key);
	
	sender.send(message, regIds, function (err, result) {
		if(err) {
			console.error(err);
			res.send(err);
		} else {
			console.log(result);
			res.send(result);
		}
	});
	
	
	
	
	
	
	
	
	
	
	
	
	//var message = new gcm.Message();
	
	//console.log('entrou push');
	
	//console.log('gcm_sender_key', config.gcm_sender_key);
	//console.log('gcm_server_key', config.gcm_server_key);
	
	//API Server Key
	//var sender = new gcm.Sender(config.gcm_sender_key); //'INSERT_YOUR_API_SENDER_KEY_HERE'
	//var registrationIds = [];
	
	// Value the payload data to send...
	//message.addData('message', 'Hello Cordova!');
	//message.addData('title','Push Notification Sample' );
	//message.addData('msgcnt','2'); // Shows up in the notification in the status bar
	//message.addData('soundname','beep.wav'); //Sound to play upon notification receipt - put in the www folder in app
	//message.collapseKey = 'demo';
	//message.delayWhileIdle = true; //Default is false
	//message.timeToLive = 3000;// Duration in seconds to hold in GCM and retry before timing out. Default 4 weeks (2,419,200 seconds) if not specified.
	
	// At least one reg id required
	//registrationIds.push(config.gcm_server_key); //'THIS_IS_THE_REGISTRATION_ID_THAT_WAS_GENERATED_BY_GCM'
	
	/**
	* Parameters: message-literal, registrationIds-array, No. of retries, callback-function
	*/
	//sender.send(message, registrationIds, 4, function (err, result) {
	//	console.log('result', result);
	//	console.log('err', err);
		
	//	res.send({resultado:result, erro: err});
	//});

};