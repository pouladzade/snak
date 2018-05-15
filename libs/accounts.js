
var burrowDbFactory       = require('@monax/legacy-db');
var fs                    = require('fs');
var path                  = require('path'); 
var schema                = require('./init').Schema;

function showAccounts(error,data){

    if(data){
        var str = JSON.stringify(data,null,4);
        saveAccounts(str);
        console.log("account count = " + data.Accounts.length) ;
        console.log(str);
    }    
    else{
        console.log(error);   
    }            
}

function saveAccounts(str)
{
    var strPath = path.join(schema.project_path,schema.accounts);
    var log_file = fs.createWriteStream((strPath + schema.accounts + ".json"), {flags : 'w'});
    log_file.write(str,'utf-8');
}

var loadAccounts = (burrowURL)=>{
    
    var burrow = burrowDbFactory.createInstance(burrowURL);
    var accounts = burrow.accounts();
    accounts.getAccounts(showAccounts);
}

var createAccount = (burrowURL, pass_phrase)=>{    
    let burrow           = burrowDbFactory.createInstance(burrowURL);
    let accounts         = burrow.accounts();

    accounts.genPrivAccount(pass_phrase, function (error, result) {
        if (!error) {
            console.log('Account : \n', JSON.stringify(result, null, 4));
        }
        else {
            console.log(error);
        }
    });
}

var getBalance = (burrowURL, address)=>{    
    let burrow           = burrowDbFactory.createInstance(burrowURL);
    let accounts         = burrow.accounts();

    accounts.getAccount(address, function (error, result) {
        if (!error) {
            console.log('Balance : ' + result.Account.Balance);
        }
        else {
            console.log(error);
        }
    });
}
module.exports = {loadAccounts,createAccount,getBalance};
