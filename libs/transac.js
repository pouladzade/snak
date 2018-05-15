var burrowDbFactory = require('@monax/legacy-db');
var fs              = require('fs');
var path            = require('path'); 
var schema          = require('./init').Schema;
var current_path    = schema.project_path;

function randomInt(max , min) {
    return Math.floor(Math.random() * (max - min) + min);
}
var trxNo = 0;
function randomtransactCallb(error,data){
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

function transactCallb(error,data){
    if(error){
        console.log(error);
    }
    else{
        console.log(JSON.stringify(data,null,4));
    }
}

var randomTransact = (burrowURL,count) =>{
    try{
        let log_file = fs.createWriteStream(current_path + schema.transactions + schema.random_transactions, {flags : 'w'});
        log_file.close();
        let accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
        let burrow  = burrowDbFactory.createInstance(burrowURL);
        let trx = burrow.txs();
        transactionNumber = 0;
        for(let i=0 ; i< count ; i++){        
            let indexSender = randomInt(accounts.length,0);
            let indexReciever = randomInt(accounts.length,0);
            let context;
            trx.transact(accounts[indexSender].privKey,accounts[indexReciever].address,"",randomInt(10000,1),randomInt(10,1),context,randomtransactCallb);
        } 
    }
    catch(ex){
        console.log(ex);
    }
}

var Transact = (burrowURL,priv_key,data,address,fee,gas_limit) =>{ 
    try{
        if(!priv_key || !fee || !address ) throw ("Invalid arguments");

        let accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
        let burrow  = burrowDbFactory.createInstance(burrowURL);
        let trx = burrow.txs();  
        let context;    
        let error = trx.transact(priv_key,address,data,fee,gas_limit,context,transactCallb);
    }
    catch(ex){
        console.log(ex);
    }
}

var Send = (burrowURL,priv_key,address,fee) =>{ 
    try{
        if(!priv_key || !fee || !address ) throw ("Invalid arguments");

        let accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
        let burrow  = burrowDbFactory.createInstance(burrowURL);
        let trx = burrow.txs();  
        let context;    
        
        let error = trx.send(priv_key,address,fee,context,transactCallb);
       
    }
    catch(ex){
        console.log(ex);
    }
}
module.exports = {randomTransact,Transact,Send};

