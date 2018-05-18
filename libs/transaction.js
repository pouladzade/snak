var burrowDbFactory = require('burrow-db');
var fs              = require('fs');
var path            = require('path'); 
var schema          = require('./init').Schema;
var current_path    = schema.project_path;
var trxNo = 0;
module.exports = class Transaction{

    constructor(burrowURL){
        
        let burrow  = burrowDbFactory.createInstance(burrowURL);
        this.trx    = burrow.txs();
    }

    randomInt(max , min) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    
    randomtransactCallb(error,data){
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
    
    transactCallb(error,data){
        if(error){
            console.log(error);
        }
        else{
            console.log(JSON.stringify(data,null,4));
        }
    }
    
    randomTransact(count){
        try{
            let log_file = fs.createWriteStream(current_path + schema.transactions + schema.random_transactions, {flags : 'w'});
            log_file.close();
            let accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
            
            for(let i=0 ; i< count ; i++){        
                let indexSender = this.randomInt(accounts.length,0);
                let indexReciever = this.randomInt(accounts.length,0);
                let context;
                this.trx.send(accounts[indexSender].privKey,accounts[indexReciever].address,this.randomInt(10000,1),context,this.randomtransactCallb);
            } 
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    Transact(priv_key,data,address,fee,gas_limit){ 
        try{
            if(!priv_key || !fee || !address ) throw ("Invalid arguments");
            
            let context;    
            let error = this.trx.transact(priv_key,address,data,fee,gas_limit,context,this.transactCallb);
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    Send(priv_key,address,fee){ 
        try{
            if(!priv_key || !fee || !address ) throw ("Invalid arguments");
           
            let context;    
            
            this.trx.send(priv_key,address,fee,context,this.transactCallb);
           
        }
        catch(ex){
            console.log(ex);
        }
    }

}



