'use strict'

var burrowDbFactory = require('burrow-db');
var Promise = require('promise');
var blockChain;
module.exports = class Blockchain{

    constructor(connectionUrl){
        
        let burrow = burrowDbFactory.createInstance(connectionUrl);
        blockChain = burrow.blockchain();
    }

    getGenesisHash(){
        
        return new Promise(function (resolve, reject) {
            blockChain.getChainId((error,data)=>{
                if(data){                                               
                    resolve(data.GenesisHash);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }

    getChainId(){        
        return new Promise(function (resolve, reject) {
            blockChain.getChainId((error,data)=>{
                if(data){                                               
                    resolve(data.ChainId);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }
        
    getInfo(){                
        return new Promise(function (resolve, reject) {
            blockChain.getInfo((error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }
    
    getLatestBlockHeight(){        
        return new Promise(function (resolve, reject) {
            blockChain.getLatestBlock((error,data)=>{
                if(data){                                               
                    resolve(data.Block.header.height);
                }    
                else{
                    reject(error);   
                } 
            })
        });
    }
    
    getLatestBlock(){
        return new Promise(function (resolve, reject) {
            blockChain.getLatestBlock((error,data)=>{
                if(data){                                               
                    resolve(data);
                }    
                else{
                    reject(error);   
                } 
            })
        });
        
    }

    getBlock(height){        
        return new Promise(function (resolve, reject) {
            blockChain.getBlock(height,(error,data)=>{
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