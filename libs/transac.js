var burrowDbFactory = require('@monax/legacy-db');
var fs              = require('fs');
var path            = require('path'); 
var schema          = require('./init').Schema;
var current_path    = schema.project_path;

function randomInt(max , min) {
    return Math.floor(Math.random() * (max - min) + min);
}
var trxNo = 0;
function randomTrxCallb(error,data){
    trxNo++;
    var strData;
    if(error){
        strData = "\n" + trxNo + " : " + JSON.stringify(error,null,4);       
    }
    else{
        strData = "\n" + trxNo + " : " + JSON.stringify(data,null,4);                
    }
    console.log(strData);
    fs.appendFile(current_path + schema.transactions + schema.random_transactions,strData,function (err) {
        if (err) throw err;});  
}

function trxCallb(error,data){
    if(error){
        console.log(error);
    }
    else{
        console.log(JSON.stringify(data,null,4));
    }
}

var randomTransact = (burrowURL,count) =>{
    try{
        var log_file = fs.createWriteStream(current_path + schema.transactions + schema.random_transactions, {flags : 'w'});
        log_file.close();
        var accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
        var burrow  = burrowDbFactory.createInstance(burrowURL);
        var trx = burrow.txs();
        transactionNumber = 0;
        for(var i=0 ; i< count ; i++){        
            var indexSender = randomInt(accounts.length,0);
            var indexReciever = randomInt(accounts.length,0);
            var context;
            trx.transact(accounts[indexSender].privKey,accounts[indexReciever].address,"",randomInt(10000,1),randomInt(10,1),context,randomTrxCallb);
        } 
    }
    catch(ex){
        console.log(ex);
    }
}

var Transact = (burrowURL,priv_key,data,address,fee,gas_limit) =>{ 
    try{
        if(!priv_key || !fee || !address ) throw ("Invalid arguments");

        var accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
        var burrow  = burrowDbFactory.createInstance(burrowURL);
        var trx = burrow.txs();      
        var error = trx.transact(priv_key,address,data,fee,gas_limit,context,trxCallb);
    }
    catch(ex){
        console.log(ex);
    }
}

module.exports = {randomTransact,Transact};

