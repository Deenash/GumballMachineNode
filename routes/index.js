var mongoose = require('mongoose');
var async = require("async") ;
var crypto    = require('crypto');
var algorithm = 'sha256';
var key="asdf1234qwer";

exports.welcome = function(req, res) {
	res.render('index', { title: 'Welcome to Node enabled Gumball Machine!!' });
};

function encryptData(message)
{
	var hmac = crypto.createHmac(algorithm, key);
	hmac.setEncoding('hex');
	hmac.write(message);
	hmac.end();
	return hmac.read();
}

exports.gumballDetails= function(req, res) {
	var dataModel = mongoose.model('GumballModel');
	
	dataModel.findOne(function(err, result) {

		if(err!=null)
		{
			res.render('error',{errorMessage:'GumballMachine Not Found'});		
		}
		else
		{
			var ts = new Date().getTime();
console.log(result)
			var message =result.serialno+""+result.modelno+key	;
			var hashValue = encryptData(message);
			res.render('gumball',{
				title:'Node Enabled Gumball Machine',
				serialno: result.serialno,
				modelno: result.modelno,
				count: result.count,
				hashValue:hashValue,
				gumballState :'No Coin State',
				status:'Please Insert Coin!!',
				ts:ts
			});
		}
	});
};

exports.updateGumballState= function(req, res) {
	
	var dataModel = mongoose.model('GumballModel');
	console.log(req.body.hashValue);
	console.log(req.body.gumballState);
	console.log(req.body.event);
	
	var hashValue = req.body.hashValue;
	var ts = req.body.ts;
	var action = req.body.event;
	var state = req.body.gumballState;
	var serialno= req.body.serialno;
	var modelno= req.body.modelno;
	var count = req.body.count;
	var status = req.body.status;
	

	
	var currentTs=new Date().getTime();
	var timeDiff = (currentTs - ts)/1000;    // in seconds
	
	var message = serialno+modelno+key
	var currentHashValue = encryptData(message);

	if(currentHashValue == hashValue && timeDiff<120)
	{
		
		if(action=="Insert Quarter")
		{
			
			if(state== "No Coin State")
			{
				state = "Has Coin State";
					status = "Coin Inserted";
			}
			else if(state=="Sold out state")
			{
				state = "Sold out state";
					status = "Coin Rejected. Gumball machine empty!!";
			}
			else
			{
				state = "Has Coin State";
					status = "Coin Rejected. Coin already present inside!!";
			}
			res.render('gumball',{
				title:'Node Enabled Gumball Machine',
				serialno: serialno,
				modelno: modelno,
				count: count,
				hashValue:hashValue,
				gumballState :state,
				status:status,
				ts:currentTs
			});
		}
		else if(action=="Turn Crank")
		{
			
			async.waterfall([
			        function(c){
			        	dataModel.findOne({serialno:serialno},c);
			        },
			        function(result,c){
			        	count = result.count;
			        	if(state=="No Coin State")
						{
							status = "Please Insert Coin!!";
						}
			        	else if(state=="Has Coin State")
						{
							if(count>0)
							{
								status = "Gumball Rolling!! Enjoy!!";
								state = "No Coin State";
								count=count-1;
								mongoose.model('GumballModel').update({serialno:serialno},
										{$set: {count:count}},{multi:true},function(err,rowCount){ });
							}
							else
							{
								status="Coin Rejected. Gumball Machine empty";
								state = "Sold out state";
							}
						}
			        	c(null, count) ;
			        }
			], 
	        function(err,count)
	        {
				if(err!=null){
				 res.render('exError', {
			            errorMessage: err.message,
			            error: err
			        });
				}
				else
				{
					res.render('gumball',{
						title:'Node Enabled Gumball Machine',
						serialno: serialno,
						modelno: modelno,
						count: count,
						hashValue:hashValue,
						gumballState :state,
						status:status,
						ts:currentTs
					});
				}
	        });
		}
	}
	else{
		
		res.render('error',{errorMessage:'Session Expired!!'});		
	}
};