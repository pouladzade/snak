


var TestContract = {

    depositCallback : function (error, data){
        if(error)
            console.log(error);
        if(data)
            console.log("deposit : +" + data.toString()); 
    },
    
    creditCallback : function (error, data){
        if(error)
            console.log(error);
        if(data)
            console.log("credit : -" + data.toString()); 
    },
    
    iterationCallback : function (error, data){
        if(error)
            console.log(error);
        if(data)
            console.log("total iterations : " + data.toString()); 
    },
    
    balanceCallback : function (error, data){
        if(error)
            console.log(error);
        if(data)
            console.log("balance : " + data.toString()); 
    },
    
    randomInt : function  () {
        return Math.floor(Math.random() * (10000 - 0) + 0);
    },

    testContract : function (){

        var fs              = require('fs');
        var path            = require('path'); 
        var burrowDbFactory = require('@monax/legacy-db');
        var contracts       = require('@monax/legacy-contracts');
        var burrowURL       = "http://localhost:1337/rpc";
        
        var accountData     = JSON.parse(fs.readFileSync(path.join(__dirname, 'account.json'),'utf-8'));
        var coinAbi         = JSON.parse(fs.readFileSync(path.join(__dirname, './Abi.json'),'utf-8'));
        var coinCompiledCode= fs.readFileSync(path.join(__dirname, './Coin-bytecode.txt'),'utf-8');
        var deployment      = JSON.parse(fs.readFileSync(path.join(__dirname, './deployment.json'),'utf-8'));
        
        var contractAddress = deployment.address;
        var contractManager = contracts.newContractManagerDev(burrowURL, accountData);
        var coinContractFactory = contractManager.newContractFactory(coinAbi);
          
        var myExistingContract;
        
        coinContractFactory.at(contractAddress, function(error, contract){
            if (error) {
                console.log(error);
                throw error;
            }
            myExistingContract = contract;
        });
        
        for(i=0 ; i<12 ; i++){
            myExistingContract.deposit(this.randomInt(),this.depositCallback);
        }
        
        for(i=0 ; i<10 ; i++){
            myExistingContract.credit(this.randomInt(),this.creditCallback);
        }
        
        myExistingContract.getIteration(this.iterationCallback);
        myExistingContract.getBalance(this.balanceCallback);

    }
};

module.exports = TestContract;


