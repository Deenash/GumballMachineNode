/**
 * New node file
 */
var mongoose = require('mongoose');

mongoose.connect('mongodb://Deenash:davincicode@ds039960.mongolab.com:39960/mongo', function(err) {
	 if (err) {
		   console.log('Could not connect to mongodb on localhost. Ensure that you have mongodb running on localhost and mongodb accepts connections on standard ports!');
			}
	});