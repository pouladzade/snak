
'use strict'

var os = require('os');

class Action {

    constructor(config){

        if(config == undefined){
            this.Config = {
                config_name:"config.json",
                burrow_url:"http://localhost:1337/rpc",
                burrow_path:"$HOME/burrow"
            }
        }
        else
            this.Config = config;

        let Blockchain = require("./libs/blockchain");
        this.blockchain = new Blockchain(this.Config.burrow_url);

        let Transaction = require("./libs/transaction");
        this.transaction = new Transaction(this.Config.burrow_url);

    }    

    getConfig(){        
        try{            
            console.log(JSON.stringify(this.Config,null,4));            
        }
        catch(ex){
            console.log(ex);
        }
    }

    compile(){
        try{
            
            let compile = require("./libs/compile");  
            compile();
            
        }
        catch(ex){
            console.log(ex);
        }
    }

    migrate( accountname){
        try{
            let deployAll = require("./libs/deploy");    
            let Link = require("./libs/link");  
            let linker = new Link();   
            linker.getDeployOrder().then(function(linkOrder){
                let bytecode;            
                try{
                    deployAll(this.Config.burrow_url,linkOrder, accountname);               
                }
                catch(ex)
                {
                    console.log(ex);
                }    
            }).catch(err=>{
                console.log(err);

            });             
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    transact(priv_key,data,address,fee,gas_limit){
        try{            
            this.transaction.Transact(priv_key,data,address,fee,gas_limit);
        }
        catch(ex){
            console.log(ex);
        }
    }

    send(priv_key,address,fee){
        try{            
            this.transaction.Send(priv_key,address,fee);
        }
        catch(ex){
            console.log(ex);
        }
    }

    bond(priv_key,address,amount,fee,pubKey){
        try{            
            this.transaction.Bond(priv_key,address,amount,fee,pubKey);
        }
        catch(ex){
            console.log(ex);
        }
    }

    unbond(priv_key,address,amount,fee){
        try{            
            this.transaction.Unbond(priv_key,address,amount,fee);
        }
        catch(ex){
            console.log(ex);
        }
    }

    randomTransact(count){
        try{            
            this.transaction.randomTransact(count);
        }
        catch(ex){
            console.log(ex);
        }
    }

    loadAccounts(){
        try{
            const loadAccounts = require("./libs/accounts").loadAccounts;
            loadAccounts(this.Config.burrow_url);
        }
        catch(ex){
            console.log(ex);
        }
    }

    getDefaultAccounts(){
        try{
            const getDefaultAccounts = require("./libs/accounts").getDefaultAccounts;
            getDefaultAccounts();
        }
        catch(ex){
            console.log(ex);
        }
    }

    createAccount(pass_phrase){
        try{
            const createAccount = require("./libs/accounts").createAccount;
            createAccount(this.Config.burrow_url , pass_phrase);
        }
        catch(ex){
            console.log(ex);
        }
    }

    getBalance(address){
        try{
            const getBalance = require("./libs/accounts").getBalance;
            getBalance(this.Config.burrow_url , address);
        }
        catch(ex){
            console.log(ex);
        }
    }

    init(){
        try{
            const projectSchema = require("./libs/init.js").ProjectSchema;        
            projectSchema.createSchema();
        }
        catch(ex){
            console.log(ex);
        }
    }

    burrow(){
        try{
            let shell = require('shelljs');
            let cmd = __dirname + '/burrow/burrow.sh';
            let child = shell.exec(cmd, {async:true});
            child.stdout.on('data', function(data) {
            });            
            
        }
        catch(ex){
            console.log(ex);       
        }
    }

    installBurrow(){

        let burrow_files = "";        

        if(os.type == "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type == "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            console.log("snak does not support your OS type: " + os.type);
            return;
        }
        try{
            let shell = require('shelljs');
            let cmd = __dirname + '/burrow/install.sh ' + __dirname + burrow_files;
            let child = shell.exec(cmd, {async:true});
            child.stdout.on('data', function(data) {
            });
            
        }
        catch(ex){
            console.log(ex);       
        }
    }

    uninstallBurrow(){
        try{
            let shell = require('shelljs');
            let cmd = __dirname + '/burrow/uninstall.sh';
            let child = shell.exec(cmd, {async:true});
            child.stdout.on('data', function(data) {
            });
            
        }
        catch(ex){
            console.log(ex);       
        }
    }

    callFunction(contract_name,function_name,parameters_list){
        let callFunc = require("./libs/functions").callFunction;
        try{
            callFunc(this.Config.burrow_url,contract_name,function_name,parameters_list);
        }
        catch(ex){
            console.log(ex);   
        }
    }

    runMonaxKeys(ip_address){

        let burrow_files = "";        

        if(os.type == "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type == "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            console.log("snak does not support your OS type: " + os.type);
            return;
        }
        try{
            let shell = require('shelljs');
            let cmd = "";
            if(ip_address == "")
                cmd = __dirname + burrow_files + '/monax-keys server &';
            else 
                cmd = __dirname + burrow_files + '/monax-keys --host ' + ip_address + ' server &';   

            let child = shell.exec(cmd, {async:true});
            child.stdout.on('data', function(data) {
            });            
        }
        catch(ex){
            console.log(ex);       
        }
    }

    getChainId(){
        try{            
            this.blockchain.getChainId();
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    getGenesisHash(){
        try{
            this.blockchain.getGenesisHash();
        }
        catch(ex){
            console.log(ex);
        }
    }


    getInfo(){
        try{            
            this.blockchain.getInfo();
        }
        catch(ex){
            console.log(ex);
        }
    }

    getLatestBlock(){
        try{            
            this.blockchain.getLatestBlock();
        }
        catch(ex){
            console.log(ex);
        }
    }
    
    getLatestBlockHeight(){
        try{            
            this.blockchain.getLatestBlockHeight();
        }
        catch(ex){
            console.log(ex);
        }
    }

    getBlock(height){
        try{            
            this.blockchain.getBlock(height);
        }
        catch(ex){
            console.log(ex);
        }
    }

    importKeys(file_name){

        let burrow_files = "";        

        if(os.type == "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type == "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            console.log("snak does not support your OS type: " + os.type);
            return;
        }

        let fs = require('fs');
        if (fs.existsSync(file_name)) {
            let keys = JSON.parse(fs.readFileSync(file_name,'utf-8'));
            keys.forEach(element => {
                
                try{
                    let shell = require('shelljs');
                    let cmd = __dirname + burrow_files + '/monax-keys import ' + element.privKey + ' --no-pass';
                    let child = shell.exec(cmd, {async:true});
                    child.stdout.on('data', function(data) {
                    });            
                }
                catch(ex){
                    console.log(ex);       
                }
            });
        }
        else{
            console.log("Error : Couldn't find the file " + file_name);
        }
    }
};

module.exports = Action;

