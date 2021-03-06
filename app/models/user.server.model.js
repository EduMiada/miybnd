'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema,
	crypto = require('crypto'),
	Band = mongoose.model('Band');
	

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
	return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
	return (this.provider !== 'local' || (password && password.length > 6));
};

/*convert string to lower case*/
function toLower (v) {
  return v.toLowerCase();
}


/**
 * User Schema
 */
var UserSchema = new Schema({
	firstName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your first name']
	},
	lastName: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your last name']
	},
	displayName: {
		type: String,
		trim: true
	},
	email: {
		type: String,
		trim: true,
		default: '',
		validate: [validateLocalStrategyProperty, 'Please fill in your email'],
		match: [/.+\@.+\..+/, 'Please fill a valid email address']
	},
	username: {
		type: String,
		unique: 'testing error message',
		required: 'Please fill in a username',
		trim: true,
		set: toLower
	},
	password: {
		type: String,
		default: '',
		validate: [validateLocalStrategyPassword, 'Password should be longer']
	},
	salt: {
		type: String
	},
	provider: {
		type: String,
		required: 'Provider is required'
	},
	
	selectedBand: {
		type: Schema.ObjectId,
		ref: 'Band'
	},
	
	providerData: {},
	additionalProvidersData: {},
	roles: {
		type: [{
			type: String,
			enum: ['user', 'admin']
		}],
		default: ['user']
	},
	updated: {
		type: Date
	},
	created: {
		type: Date,
		default: Date.now
	},
	/* For reset password */
	resetPasswordToken: {
		type: String
	},
	resetPasswordExpires: {
		type: Date
	},
	
	showHelp: {
		type: Boolean
	},
	
	bands:[{
		_id:{type: Schema.ObjectId},
		selected:{type: Boolean},
		name:{type:String}
	}],
	
    picture: {
		type: String
	},
    
    picture_small: {
		type: String
	},

	avatar: {
		type: String
	},
	
	avatarPreview: {
		type: String
	},
	
	spotifyAuthCode: String,
    
    profile: {},
    contact:{},
    channels:{},
    
    about: String,
    city:String,
    area:String,
    zipcode:String,
    soundcloud:String,
    youtube:String,
    styles:String,
    influency:String,
    instrument:String,
    experience:String,
    bio:String
});




/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
	
     this.wasNew = this.isNew;
     if (this.password && this.password.length > 6) {
		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
		this.password = this.hashPassword(this.password);
	}
    
    if (this.wasNew) { 
        var band = new Band();
        band.name = 'Personal';
        band.user =   this;
        band.personal = true;
        band.members.push({'admin': 1, member: band.user});

        band.save(function(err) {            
            if (err) {
                console.log('Error Creating Personal Band', err);
            } else{
                console.log('banda incluida') ;
                next();
            }
        });
    }
    
    next();
});


//always create a new personal band to user if its new
UserSchema.post('save', function (next) {   
   /* if (this.wasNew) {
        
    }
    */
});


/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
	if (this.salt && password) {
		return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
	} else {
		return password;
	}
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
	return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
	var _this = this;
	var possibleUsername = username + (suffix || '');

	_this.findOne({
		username: possibleUsername
	}, function(err, user) {
		if (!err) {
			if (!user) {
				callback(possibleUsername);
			} else {
				return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
			}
		} else {
			callback(null);
		}
	});
};


/*
UPDATE USERS CURRENT BANDS
*/
UserSchema.statics.setCurrentBand = function(userID, selectedBandID, callback) {
	var _this = this;
	var bandObjectID = mongoose.Types.ObjectId(selectedBandID);
	//var userObjectID = mongoose.Types.ObjectId(userID);
	
	_this.findById(userID, '_id, selectedBand').exec(function(err, user) {
		
		if (!user) {
				console.log(err);
		} else {
			//console.log('newBandID', bandObjectID);
			if (bandObjectID){
				user.selectedBand = bandObjectID;			
			}
			//console.log('updateband', user);
			user.save(function(err) {
					if (err) {
						console.log(err);
						callback(false);							
					} else {
						
						callback(true);
					}
			});
			
		}
				
	});
};




mongoose.model('User', UserSchema);