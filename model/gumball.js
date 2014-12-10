/**
 * New node file
 */


var mongoose = require('mongoose');
var schema = mongoose.Schema;

var gumballSchema = new schema({
	
	id:Number,modelno:Number,serialno:Number,count:Number
});

var model = mongoose.model('GumballModel',gumballSchema,'Gumball');