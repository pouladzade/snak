'use strict'


var fs              = require('fs');
var path            = require('path'); 
var schema          = require('../schema').Schema;
var Promise         = require('promise');
var current_path    = schema.project_path;
var trxNo = 0;
var trx = null;

module.exports = class Unsafe{

    constructor(burrowURL){
        
        let burrowDbFactory = require('burrow-db');
        let burrow  = burrowDbFactory.createInstance(burrowURL);
        trx    = burrow.txs();
    }

    randomInt(max , min) {
        return Math.floor(Math.random() * (max - min) + min);
    }    

    randomTransact(count, logger){
        try{
            let log_file = fs.createWriteStream(current_path + schema.transactions + schema.random_transactions, {flags : 'w'});
            log_file.close();
            let accounts = JSON.parse(fs.readFileSync(path.join(current_path + schema.accounts + schema.account_list),'utf-8'));  
            
            for(let i=0 ; i< count ; i++){        
                let indexSender = this.randomInt(accounts.length,0);
                let indexReciever = this.randomInt(accounts.length,0);
                let context;
                trx.send(accounts[indexSender].privKey,accounts[indexReciever].address,this.randomInt(10000,1),context,(error,data)=>{
                    trxNo++;
                    var strData;
                    if(error){
                        strData = "\n" + trxNo + " : " + JSON.stringify(error,null,4);  
                        logger.error(strData);     
                    }
                    else{
                        strData = "\n" + trxNo + " : " + JSON.stringify(data,null,4); 
                        logger.info(strData);               
                    }                    
                    fs.appendFile(current_path + schema.transactions + schema.random_transactions,strData,function (err) {
                        if (err) throw err;});  
                });
            } 
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    transact(priv_key,data,address,fee,gas_limit){ 
        let context;
        return new Promise(function (resolve, reject) {
            trx.transact(priv_key,address,data,fee,gas_limit,context,(error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        });        
    }
    
    send(priv_key,address,amount){              
        let context;
        return new Promise(function (resolve, reject) {
            trx.send(priv_key,address,amount,context,(error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        }); 
    }

    bond(priv_key,address,amount,fee,pubKey){ 
        let context;    
        return new Promise(function (resolve, reject) {
            trx.bond(priv_key,address,amount,fee,pubKey,context,(error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }

    unbond(privKey,address,amount,fee){    
        let context;    
        return new Promise(function (resolve, reject) {
            trx.unbond(privKey,address,amount,fee,context,(error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }

}



