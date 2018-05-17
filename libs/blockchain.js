
var burrowDbFactory       = require('burrow-db');
var fs                    = require('fs');
var path                  = require('path'); 
var schema                = require('./init').Schema;
var burrow_url            = "http://127.0.0.1:1337/rpc";

function callBack(error,data){

    if(data){
        let str = JSON.stringify(data,null,4);                
        console.log(str);
    }    
    else{
        console.log(error);   
    }            
}


var getGenesisHash = (burrowURL)=>{
    
    if(!burrowURL) burrowURL = burrow_url 
    let burrow = burrowDbFactory.createInstance(burrowURL);
    let Blockchain = burrow.blockchain();
    Blockchain.getChainId((error,data)=>{
        if(data){                           
            console.log(" \n GenesisHash = " + data.GenesisHash);
        }    
        else{
            console.log(error);   
        } 
    });
}


var getChainId = (burrowURL)=>{
    
    var burrow = burrowDbFactory.createInstance(burrowURL);
    var Blockchain = burrow.blockchain();
    Blockchain.getChainId(callBack);
}


var getInfo = (burrowURL)=>{
    
    var burrow = burrowDbFactory.createInstance(burrowURL);
    var Blockchain = burrow.blockchain();
    Blockchain.getInfo(callBack);
}

var getLatestBlockHeight = (burrowURL)=>{
    
    var burrow = burrowDbFactory.createInstance(burrowURL);
    var Blockchain = burrow.blockchain();
    Blockchain.getLatestBlockHeight(callBack);
}

var getLatestBlock = (burrowURL)=>{
    
    var burrow = burrowDbFactory.createInstance(burrowURL);
    var Blockchain = burrow.blockchain();
    Blockchain.getLatestBlock(callBack);
}


module.exports = {getGenesisHash,getChainId,getLatestBlockHeight,getInfo,getLatestBlock};
