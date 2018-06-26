
'use strict'

var os     = require('os');
var Logger = require('./libs/logger');
var logger = new Logger();

module.exports = class Action {

    constructor(config){

        if(config == undefined){
            this._Config = {
                config_name:"config.json",
                burrow_url:"http://localhost:1337/rpc",
                burrow_path:"$HOME/burrow"
            }
        }
        else{
            this._Config = config;
        }
        
        this._blockchain = null;
        this._unsafeTx   = null;
        this._sendTx     = null;
        this._callTx     = null;
        this._bondTx     = null;
        this._unbondTx   = null;
        this._accounts   = null;
        this._compile    = null;
        this._project    = null;
        this._functions  = null;        
    } 

    _unsafeTxHandler(){
        if (this._unsafeTx != null){
            return this._unsafeTx;
        }
        else{
            let Unsafe = require("./libs/transactions/unsafe");
            this._unsafeTx = new Unsafe(this._Config.burrow_url);
            return this._unsafeTx;
        }
    }     

    _sendTxHandler(){
        if (this._sendTx != null){
            return this._sendTx;
        }
        else{
            let SendTx = require("./libs/transactions/send");
            this._sendTx = new SendTx(this._Config.burrow_url);
            return this._sendTx;
        }
    } 

    _callTxHandler(){
        if (this._callTx != null){
            return this._callTx;
        }
        else{
            let CallTx = require("./libs/transactions/call");
            this._callTx = new CallTx(this._Config.burrow_url);
            return this._callTx;
        }
    } 

    _bondTxHandler(){
        if (this._bondTx != null){
            return this._bondTx;
        }
        else{
            let BondTx = require("./libs/transactions/bond");
            this._bondTx = new BondTx(this._Config.burrow_url);
            return this._bondTx;
        }
    } 

    _unbondTxHandler(){
        if (this._unbondTx != null){
            return this._unbondTx;
        }
        else{
            let UnbondTx = require("./libs/transactions/unbond");
            this._unbondTx = new UnbondTx(this._Config.burrow_url);
            return this._unbondTx;
        }
    } 

    _accountHandler(){
        if (this._accounts != null){
            return this._accounts;
        }
        else{
            let Accounts = require("./libs/accounts") ;
            this._accounts = new Accounts(this._Config.burrow_url);
            return this._accounts;
        }
    } 

    _compileHandler(){
        if (this._compile != null){
            return this._compile;
        }
        else{
            let Compile  = require("./libs/compile");
            this._compile = new Compile();
            return this._compile;
        }
    } 

    _projectHandler(){
        if (this._project != null){
            return this._project;
        }
        else{
            let Project  = require("./libs/project");
            this._project = new Project();    
            return this._project;
        }
    } 

    _blockchainHandler(){
        if (this._blockchain != null){
            return this._blockchain;
        }
        else{
            let Blockchain = require("./libs/blockchain");
            this._blockchain = new Blockchain(this._Config.burrow_url);
            return this._blockchain;
        }
    }   

    _deployHandler(){
        if(this.deploy != null){
            return this.deploy;
        }            
        else{
            let Deploy  = require("./libs/deploy");
            this.deploy = new Deploy(this._Config.burrow_url);
            return this.deploy;
        }         
    }

    _functionHandler(){
        if(this._functions != null){
            return this._functions;
        }            
        else{
            let Functions  = require("./libs/functions");
            this._functions = new Functions();
            return this._functions;
        }         
    }

    getConfig(){        
        try{            
            logger.console(JSON.stringify(this._Config,null,4));
            return this._Config;         
        }
        catch(ex){
            logger.error(ex);
        }
    }

    compileAll(){
        try{                        
            this._compileHandler().compileAll();            
        }
        catch(ex){
            logger.error(ex);
        }
    }

    migrate( accountName,isForce){
        try{             
            let Link = require("./libs/link");  
            let linker = new Link();   
            var _this  = this;
            linker.getDeployOrder().then(function(linkOrder){                           
                try{
                    _this._deployHandler().deployAll(linkOrder, accountName,isForce);               
                }
                catch(ex)
                {
                    logger.error(ex);
                }    
            }).catch(err=>{
                logger.error(err);

            });             
        }
        catch(ex){
            logger.error(ex);
        }
    }
    
    transact(privateKey,data,address,fee,gasLimit,unsafe){   
        if(unsafe === true){
            this._unsafeTxHandler().transact(privateKey,data,address,fee,gasLimit).then(data => {
                logger.console(JSON.stringify(data,null,4));
            })
            .catch(function(ex) {
                logger.error(JSON.stringify(ex,null,4));           
            });
        }   
        else{
            this.broadcastCall(privateKey,data,address,fee,gasLimit);
        }          
    }

    send(privateKey,address,amount,unsafe){   
        if(unsafe === true){
            this._unsafeTxHandler().send(privateKey,address,amount).then(data => {
                logger.console(JSON.stringify(data,null,4));
            })
            .catch(function(ex) {
                logger.error(JSON.stringify(ex,null,4));           
            });
        } 
        else{
            this.broadcastSend(privateKey,address,amount);
        }    
    }

    bond(privateKey,address,amount,fee,pubKey,unsafe){                 
        if(unsafe === true){
            this._unsafeTxHandler().bond(privateKey,address,amount,fee,pubKey).then(data => {
                logger.console(JSON.stringify(data,null,4));
            })
            .catch(function(ex) {
                logger.error(JSON.stringify(ex,null,4));           
            });
        } 
        else{
            this.broadcastBond(privateKey,address,amount,fee,pubKey);
        } 
    }

    unbond(privateKey,address,amount,fee,unsafe){                          
        if(unsafe === true){
            this._unsafeTxHandler().unbond(privateKey,address,amount,fee).then(data => {
                logger.console(JSON.stringify(data,null,4));
            })
            .catch(function(ex) {
                logger.error(JSON.stringify(ex,null,4));           
            });
        } 
        else{
            this.broadcastUnbond(privateKey,address,amount,fee);
        } 
    }

    randomTransact(count){
        try{            
            this._unsafeTxHandler().randomTransact(count,logger);
        }
        catch(ex){
            logger.error(ex);
        }
    }

    loadAccounts(){
        this._accountHandler().loadAccounts()
        .then(accounts => {
            logger.console("accounts :\n" + JSON.stringify(accounts,null,4));
        })
        .catch(ex => {
            logger.error(ex);
        });
    }

    getDefaultAccounts(){
        this._accountHandler().getDefaultAccounts()
        .then(accounts => {
            logger.console("Default accounts :\n" + JSON.stringify(accounts,null,4));
        })
        .catch(function(ex) {
            logger.error(ex);           
        });
    }

    createAccount(passPhrase){
        this._accountHandler().createAccount(passPhrase)
        .then(account => {
            logger.console("Account :\n" + JSON.stringify(account,null,4));
        })
        .catch(function(ex) {
            logger.error(ex);           
        });
    }

    getBalance(address,cmd){
        console.log(cmd);
        this._accountHandler().getBalance( address)
        .then(balance => {
            logger.console("Balance : " + balance);
        })
        .catch(function(ex) {
            logger.error(ex);           
        });
    }

    getSequence(address){
        this._accountHandler().getSequence( address)
        .then(sequence => {
            logger.console("Sequence : " + sequence);
        })
        .catch(function(ex) {
            logger.error(ex);           
        });
    }

    init(){
        try{             
            this._projectHandler().createSchema();
        }
        catch(ex){
            logger.error(ex);
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
            logger.error(ex);       
        }
    }

    installBurrow(){

        let burrow_files = "";        

        if(os.type === "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type === "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            logger.console("snak does not support your OS type: " + os.type);
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
            logger.error(ex);       
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
            logger.error(ex);       
        }
    }

    callFunction(contract_name,function_name,parameters_list){
        
        try{
            this._functionHandler().callFunction(this._Config.burrow_url,contract_name,function_name,parameters_list);
        }
        catch(ex){
            logger.error(ex);   
        }
    }

    runMonaxKeys(ip_address){

        let burrow_files = "";        

        if(os.type === "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type === "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            logger.console("snak does not support your OS type: " + os.type);
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
            logger.error(ex);
            throw ex;                   
        }
    }

    getChainId(){
        return this._blockchainHandler().getChainId()
        .then(chainId => {
            logger.console("Chain ID :\n" + JSON.stringify(chainId,null,4));
        })
        .catch(ex => {
            logger.error(ex);
        });
    }
    
    getGenesisHash(){
        return this._blockchainHandler().getGenesisHash()
        .then(genesisHash => {
            logger.console("Genesis Hash :\n" + genesisHash);
        })
        .catch(ex => {
            logger.error(ex);
        });
    }

    getInfo(){
        return this._blockchainHandler().getInfo()
        .then(info => {
            logger.console("info block :\n" +  JSON.stringify(info,null,4));
        })
        .catch(ex => {
            logger.error(ex);
        });
    }

    getLatestBlock(){
        return this._blockchainHandler().getLatestBlock()
        .then(block => {
            logger.console("Latest block :\n" + JSON.stringify(block,null,4));
        })
        .catch(ex => {
            logger.error(ex);
        });
    }
    
    getLatestBlockHeight(){          
        return this._blockchainHandler().getLatestBlockHeight()
        .then(latestBlockHeight => {
            logger.console("Ltest block height :" + latestBlockHeight);
        })
        .catch(ex => {
            logger.error(ex);
        });
    }

    getBlock(height){
        return this._blockchainHandler().getBlock(height)
        .then(block => {
            logger.console("block :\n" + JSON.stringify(block,null,4));
        })
        .catch(ex => {
            logger.error(ex);
        });
    }

    importKeys(file_name){

        let burrow_files = "";        

        if(os.type == "Linux")
            burrow_files = '/burrow/burrow-linux';
        else if (os.type == "Darwin")
            burrow_files = '/burrow/burrow-darwin';              
        else{
            logger.error("snak does not support your OS type: " + os.type);
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
                    logger.error(ex);       
                }
            });
        }
        else{
            logger.error("Couldn't find the file " + file_name);
        }
    }

    broadcastSend(privKey,address,amount){                
        return this._sendTxHandler().broadcast(privKey,address,amount).then(data =>{
            logger.console("Safe Send Tx result :\n" + JSON.stringify(data,null,4));
        }).catch(ex => {
            logger.error(ex);
        });
    }

    broadcastCall(privKey,address,gasLimit,fee,data){                
        return this._callTxHandler().broadcast(privKey,address,gasLimit,fee,data).then(data =>{
            logger.console("Safe Transact Tx result :\n" + JSON.stringify(data,null,4));
        }).catch(ex => {
            logger.error(ex);
        });
    }

    broadcastBond(privKey,address,amount,fee,pubKey){                
        return this._bondTxHandler().broadcast(privKey,address,amount,fee,pubKey).then(data =>{
            logger.console("Safe Bond Tx result :\n" + JSON.stringify(data,null,4));
        }).catch(ex => {
            logger.error(ex);
        });
    }

    broadcastUnbond(privKey,address,amount,fee){                
        return this._unbondTxHandler().broadcast(privKey,address,amount,fee).then(data =>{
            logger.console("Safe Unbond Tx result :\n" + JSON.stringify(data,null,4));
        }).catch(ex => {
            logger.error(ex);
        });
    }
};