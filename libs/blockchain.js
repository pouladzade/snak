'use strict'

var burrowDbFactory = require('burrow-db');


class Blockchain{

    constructor(burrowURL){

        this.burrowUrl = burrowURL;
        let burrow = burrowDbFactory.createInstance(this.burrowUrl);
        this.blockChain = burrow.blockchain();
    }

    callBack(error,data){

        if(data){
            let str = JSON.stringify(data,null,4);                
            console.log(str);
        }    
        else{
            console.log(error);   
        }            
    }

    getGenesisHash(){

        this.blockChain.getChainId((error,data)=>{
            if(data){                           
                console.log(" \n Genesis Hash = " + data.GenesisHash);
            }    
            else{
                console.log(error);   
            } 
        });
    }

    getChainId(){

        this.blockChain.getChainId(this.callBack);
    }
        
    getInfo(){
        
        this.blockChain.getInfo(this.callBack);
    }
    
    getLatestBlockHeight(){
        
        this.blockChain.getLatestBlock((error,data)=>{
            if(data){                           
                console.log(" \n Latest Block Height = " + data.Block.header.height);
            }    
            else{
                console.log(error);   
            } 
        });
    }
    
    getLatestBlock(){
        
        this.blockChain.getLatestBlock(this.callBack);
    }

    getBlock(height){
        this.blockChain.getBlock(height , this.callBack);
    }

}


module.exports = Blockchain;