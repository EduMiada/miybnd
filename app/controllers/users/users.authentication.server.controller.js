'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
	errorHandler = require('../errors.server.controller'),
	mongoose = require('mongoose'),
	passport = require('passport'),
	User = mongoose.model('User'),
	request = require('request'),
	async = require('async'),
	jwt    = require('jsonwebtoken'), // used to create, sign, and verify tokens
	config = require('../../../config/config'),
	Band = mongoose.model('Band'),
    async = require('async'),
    querystring = require('querystring'),
    SpotifyWebApi = require('spotify-web-api-node');





/*
API CODE
*/

exports.apiList = function(req, res, next) {
	
		res.json({
				success: true,
				message: 'API RESPONSE!',
		});
		
		//next();
			
};

exports.signin_API = function(req, res, next) {
	//console.log('aqui autenticacao');
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {

			user.password = undefined;
			user.salt = undefined;	
			
			// create a token
			var token = jwt.sign(user, config.secret, {
				expiresInMinutes: 1440 // expires in 24 hours
			});
	
			var userID = user._id;
			var selectedBandID = 0;
            if(user.selectedBand) selectedBandID = user.selectedBand._id;
			
			//console.log(user);
			
			
			Band.userBands(userID, selectedBandID, function (bands){
				user.bands = [];
				user.bands = bands;
				console.log(user);
							// return the information including token as JSON
				res.json({
					success: true,
					token: token,
					data: user
				});	

			}) ;
	
	
	
		}   
		
		})	(req, res, next);		
};




	
// route middleware to verify a token
exports.checkToken_API = function(req, res, next) {
	
		// check header or url parameters or post parameters for token
		var token = req.body.token || req.query.token || req.headers['x-access-token'];
		
        
        console.log('check token');
        
		// decode token
		if (token) {
			// verifies secret and checks exp
			jwt.verify(token, config.secret, function(err, decoded) {      
			if (err) {
				return res.json({ success: false, message: 'Failed to authenticate token.' });    
			} else {
				// if everything is good, save to request for use in other routes
				
				req.user = decoded;    
				next();
			}
			});
		
		} else {
		
			// if there is no token
			// return an error
			return res.status(403).send({ 
				success: false, 
				message: 'No token provided.' 
			});
			
		}

};
	
	
//route to signin with facebook client token got from client app
//will transform de short token to long live token
//check if user exists and create and return a app token
exports.facebookClientToken_API = function(req, res, next){
    
    // check header or url parameters or post parameters for token
    var clientToken = req.body.token || req.query.token || req.headers['x-access-token'];
    
    //exchange the token with server
    var url = 'https://graph.facebook.com';
       
    var post_data = '/oauth/access_token?grant_type=fb_exchange_token';
    post_data = post_data + '&client_id=' + config.facebook.clientID;
    post_data = post_data + '&client_secret=' + config.facebook.clientSecret;
    post_data = post_data + '&fb_exchange_token=' +  clientToken;

    request.get(url + post_data, function(error, response, data) {
        if (error) {
            console.log('ERROR', error);
            next();
        }
        else {
         
            console.log('chando profile', data);
         
            getFacebookProfile(url, data, function(err, profile){
                if (!profile){
                    console.log('erro', err);
                } else{   
                    createLoginFacebookUser(req, profile, function(error, user) {
                        if(error){
                            console.log(error);
                        }else{  
                            
                            user.password = undefined;
                            user.salt = undefined;	
                            
                            // create a token
                            var token = jwt.sign(user, config.secret, {
                                expiresInMinutes: 1440 // expires in 24 hours
                            });
                    
                            var userID = user._id;
                            var selectedBandID = 0;
                            
                            if (user.selectedBand)  selectedBandID = user.selectedBand._id;
                            
                            Band.userBands(userID, selectedBandID, function (bands){
                                user.bands = [];
                                user.bands = bands;

                                res.json({
                                    success: true,
                                    token: token,
                                    data: user
                                });	

                            }) ;
                    
                        }
                    });
                }
            });
        }
    });
    
};

//Parse the user profile data and get user picture profile based on the new long time token
function getFacebookProfile(url, data, callback){
    var parsedResponse = querystring.parse(data);
    var access_token = parsedResponse.access_token;
    var expires = parsedResponse.expires;  
    var post_data = '/me?fields=name,first_name,last_name,email,picture&access_token=' + access_token;

    //call me api
    request.get(url + post_data, function(error, response, data) {

        if (error) {
            console.log('Error getFacebookProfile', error);
            callback(error, null);
        }
        else {
            if ('string' == typeof data) {
                var json = JSON.parse(data);
            }

            var profile = {};
                profile.provider = 'facebook';
                profile.id = json.id;
                profile.username = json.id;
                profile.displayName = json.name;
                profile.name = json.name;
                profile.firstName = json.first_name;
                profile.lastName = json.last_name;
                profile.profileUrl = 'https://graph.facebook.com/me';
                profile.providerIdentifierField = 'id';
                profile.accessToken = access_token;
                profile.expires = expires;
                profile.picture = undefined;
                profile.providerData = {id: profile.id , accessToken:profile.accessToken, expires:profile.expires, profileUrl:profile.profileUrl};
              
            
            
            if (!json.picture) {
                callback(null, profile);
            }else{
                if (typeof json.picture == 'object' && json.picture.data) {
                    getFacebookProfilePicture(json.picture.data.url, function(err, image){
                        if(image){
                            profile.picture = image;                   
                        }  
                         callback(null, profile);
                    });
                }
            }
        }
            
    });
}
    

//Parse the user profile picture
function getFacebookProfilePicture(url, callback){
    var request = require('request').defaults({ encoding: null });

    request.get(url, function (error, response, body) {
        if(error || response.statusCode ==! 200){
            callback(error,  null);
        }else {
            var image  = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
            callback(null,  image);
        }
     });

};

/**
 * Helper function to save or update a OAuth user profile
 */
function createLoginFacebookUser (req, providerUserProfile, callback) {
    
	if (!req.user) {
        
        console.log('user',providerUserProfile);  
        
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

        console.log('Main Search Provider', mainProviderSearchQuery);
        console.log('additional Search Provider', additionalProviderSearchQuery);

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return callback(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
                            picture: providerUserProfile.picture,
                            picture_small: providerUserProfile.picture,
							providerData: providerUserProfile.providerData,
                            selectedBand: undefined
						});

						// And save the user
						user.save(function(err, user) {
                            return callback(err, user);    
						});
					});
				} else {
					return callback(err, user);
				}
			}
		});
	}
};





exports.connectSpotifyAccount_API = function(req, res){
   
    
    var clientToken = req.body.spotifyprofile || req.query.spotifyprofile;
    
    console.log('client token',clientToken);
    //var json = JSON.parse(clientToken);
  
    console.log('log json', clientToken.code);
  
    var params=[];
        params['code'] = clientToken.code;
        params['client_id'] = config.spotify.clientID;
        params['client_secret']=config.spotify.clientSecret;
        params['grant_type'] ='authorization_code';
        params['redirect_uri']= 'http://localhost/callback';
        
    var post_data = querystring.stringify(params);
   
   	var authOptions = {
      	url: 'https://accounts.spotify.com/api/token?' + post_data ,
      	headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
      	}
    };

    request.post(authOptions, function(error, body, response) {
        
        if (error){
         	res.json({success: false, error:error});
        } 
        else {
            if ('string' == typeof response) {
                response = JSON.parse(response);
            }
            
            
            var providerData = profile._json;
			providerData.accessToken = accessToken;
			providerData.refreshToken = refreshToken;



			/*// Create the user OAuth profile
			var providerUserProfile = {
				firstName: profile.displayName,
				//lastName: profile.name.familyName,
				displayName: profile.displayName,
				email: profile.emails[0].value,
				username: profile.username,
				provider: 'spotify',
				providerIdentifierField: 'id',
				providerData: providerData,
				code:req.query.code
			};

			// Save the user OAuth profile
			users.saveOAuthUserProfile(req, providerUserProfile, done);
            */
            console.log(response);
                console.log(response.access_token);
            //var results = JSON.parse(body);
            //var access_token = results.access_token;
            //var refresh_token = results.refresh_token;  
            //delete results.refresh_token; 
        }
    });
      
      
      
      res.json('{data:1}');
};

  
	

	



exports.connectSpotifyAccount_API_NEW = function(req, res){
   
  //  console.log('iniciando chamada api spotify')
    getSpotifyProfileFromCode(req, function(err, data){
        if (err){
    //        console.log('Erro Spotify', err);
            res.json({success: false, token: req.user.token, data: null});	
        }else{
      //      console.log('Spotify OK', data);
            res.json({success: true,token: req.user.token,data: data});	
        }
    });
       
       
};

function getSpotifyProfileFromCode(req, callback){
    
    var clientToken = req.body.spotifyprofile || req.query.spotifyprofile;
  
    var spotifyApi = new SpotifyWebApi({
        clientId : config.spotify.clientID,
        clientSecret : config.spotify.clientSecret,
        redirectUri :'http://localhost/callback'
    });
    
    var providerData = {};

    // First retrieve an access token
    spotifyApi.authorizationCodeGrant(clientToken.code)
    .then(function(data) {
        var result = data.body;
    
        if ('string' == typeof result) {
            result = JSON.parse(result);
        }

        providerData.accessToken = result.access_token;
        providerData.refreshToken = result.refresh_token;

    
        // Set the access token
        spotifyApi.setAccessToken(result.access_token);

        // Use the access token to retrieve information about the user connected to it
        return spotifyApi.getMe();
    })
    .then(function(data) {
        var result = data.body;
        if ('string' == typeof result) {
            result = JSON.parse(result);
        }
       
        result.accessToken = providerData.accessToken;
        result.refreshToken = providerData.refreshToken;

        updateSpotifyProfile(req, result, function(err, user){
           // console.log('retorno callback update');
            return callback (err, user);        
        });
        
    
        
    });

};






/**
 * Helper function to update a OAuth user profile with spotify
 */
function updateSpotifyProfile (req, providerUserProfile, callback) {
    
    if(req.user){
        User.findOne({_id: req.user._id}).select({_id: 1, additionalProvidersData: 1 }).exec(function(err, user) {
		  
            if (err) return callback(err, null);
    
            providerUserProfile.provider = 'spotify';

            if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
                if (!user.additionalProvidersData) user.additionalProvidersData = {};
                user.additionalProvidersData[providerUserProfile.provider]=providerUserProfile;

                // Then tell mongoose that we've updated the additionalProvidersData field
                user.markModified('additionalProvidersData');

            //    console.log('update spotify after markmodified');

                // And save the user
                user.save(function(err) {
                    req.user.additionalProvidersData = user.additionalProvidersData;
                    return callback (null, req.user);
                });


            }else{
                return callback (null, req.user);
            }



    	});
      
        


    
    }       
            
    //return callback (null, user);
};




/**
 * Signup
 */
exports.signup = function(req, res) {
	// For security measurement we remove the roles from the req.body object
	delete req.body.roles;

	// Init Variables
	var user = new User(req.body);
	var message = null;

	// Add missing user fields
	user.provider = 'local';
	user.displayName = user.firstName + ' ' + user.lastName;

	// Then save the user 
	user.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			
			
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {
					res.json(user);
				}
			});
		}
	});
};

/**
 * Signin after passport authentication
 */
exports.signin = function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err || !user) {
			res.status(400).send(info);
		} else {
			
			// Remove sensitive data before login
			user.password = undefined;
			user.salt = undefined;
			
			req.login(user, function(err) {
				if (err) {
					res.status(400).send(err);
				} else {

					//console.log('sigin',  user);
	
					res.json(user);
	
				}
		
			});
			
	
		}
	})
	(req, res, next);
};


/**
 * Signout
 */
exports.signout = function(req, res) {
	req.logout();
	res.redirect('/');
};

/**
 * OAuth callback
 */
exports.oauthCallback = function(strategy) {
	return function(req, res, next) {
			
		passport.authenticate(strategy, function(err, user, redirectURL) {
			
            console.log('auth err', err);
            
			if (err || !user) {
				return res.redirect('/#!/signin');
			}
			req.login(user, function(err) {
				if (err) {
					return res.redirect('/#!/signin');
				}

				return res.redirect(redirectURL || '/');
			});
		})(req, res, next);
	};
};



/**
 * Helper function to save or update a OAuth user profile
 */
exports.saveOAuthUserProfile = function(req, providerUserProfile, done) {
	
    console.log('user',providerUserProfile);
    
    
	if (!req.user) {
		// Define a search query fields
		var searchMainProviderIdentifierField = 'providerData.' + providerUserProfile.providerIdentifierField;
		var searchAdditionalProviderIdentifierField = 'additionalProvidersData.' + providerUserProfile.provider + '.' + providerUserProfile.providerIdentifierField;

		// Define main provider search query
		var mainProviderSearchQuery = {};
		mainProviderSearchQuery.provider = providerUserProfile.provider;
		mainProviderSearchQuery[searchMainProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];

		// Define additional provider search query
		var additionalProviderSearchQuery = {};
		additionalProviderSearchQuery[searchAdditionalProviderIdentifierField] = providerUserProfile.providerData[providerUserProfile.providerIdentifierField];


        console.log('Main Search Provider', mainProviderSearchQuery);

        console.log('additional Search Provider', additionalProviderSearchQuery);

		// Define a search query to find existing user with current provider profile
		var searchQuery = {
			$or: [mainProviderSearchQuery, additionalProviderSearchQuery]
		};

		User.findOne(searchQuery, function(err, user) {
			if (err) {
				return done(err);
			} else {
				if (!user) {
					var possibleUsername = providerUserProfile.username || ((providerUserProfile.email) ? providerUserProfile.email.split('@')[0] : '');

					User.findUniqueUsername(possibleUsername, null, function(availableUsername) {
						user = new User({
							firstName: providerUserProfile.firstName,
							lastName: providerUserProfile.lastName,
							username: availableUsername,
							displayName: providerUserProfile.displayName,
							email: providerUserProfile.email,
							provider: providerUserProfile.provider,
							providerData: providerUserProfile.providerData
						});

						// And save the user
						user.save(function(err) {
							return done(err, user);
						});
					});
				} else {
					return done(err, user);
				}
			}
		});
	} else {
		// User is already logged in, join the provider data to the existing user
		var user = req.user;
		
		console.log('user logged-oauth');

		// Check if user exists, is not signed in using this provider, and doesn't have that provider data already configured
		if (user.provider !== providerUserProfile.provider && (!user.additionalProvidersData || !user.additionalProvidersData[providerUserProfile.provider])) {
			// Add the provider data to the additional provider data field
			if (!user.additionalProvidersData) user.additionalProvidersData = {};
			user.additionalProvidersData[providerUserProfile.provider] = providerUserProfile.providerData;

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');

			// And save the user
			user.save(function(err) {
				return done(err, user, '/#!/settings/accounts');
			});
		} else {
			return done(new Error('User is already connected using this provider'), user);
		}
	}
};

/**
 * Remove OAuth provider
 */
exports.removeOAuthProvider = function(req, res, next) {
	var user = req.user;
	var provider = req.param('provider');

	if (user && provider) {
		// Delete the additional provider
		if (user.additionalProvidersData[provider]) {
			delete user.additionalProvidersData[provider];

			// Then tell mongoose that we've updated the additionalProvidersData field
			user.markModified('additionalProvidersData');
		}

		user.save(function(err) {
			if (err) {
				return res.status(400).send({
					message: errorHandler.getErrorMessage(err)
				});
			} else {
				req.login(user, function(err) {
					if (err) {
						res.status(400).send(err);
					} else {
						res.json(user);
					}
				});
			}
		});
	}
};