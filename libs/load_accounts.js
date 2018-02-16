
var burrowDbFactory       = require('@monax/legacy-db');
var fs                    = require('fs');
var path                  = require('path'); 
var schema                = require('./init').Schema;
//////////////////////////////////////////////////////////////////////////////////////////////
//  display all accounts and write them in 'account-out.json'
function showAccounts(error,data){

    if(data){
        var str = JSON.stringify(data,null,4);
        saveAccounts(str); 
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

module.exports = loadAccounts;
