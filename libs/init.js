'use strict'

var fs = require("fs");
var promise = require("promise");

var dirCallb = function (error,data){
    if(error){
        console.log(error);
    }                
}

var Schema = {
    project_path : process.cwd(),
    snack_path : __dirname,
    test : "/test",
    contracts : "/contracts",
    migration : "/migration",
    migration_output:"/migration_output_",
    build : "/build",
    accounts : "/accounts",
    account_list: "/account_list.json",
    default_account: "/account.json",
    transactions: "/transactions",
    random_transactions: "/random_transactions.json",
    template: "/templates",
    config_file : "/config.json",
    link_order_file: "/link_order.json"   
}

var ProjectSchema = {

    createSchema: function(){
        return new promise(function (fulfil,reject){
            var callback = function(error , data){
                if(error)
                    reject(error);
            }
            try{
                fs.copyFile(Schema.snack_path +Schema.template + Schema.config_file, Schema.project_path + Schema.config_file, (err) => {
                    if (err) throw err;
                });

                fs.mkdir(Schema.project_path + Schema.build,callback);
                fs.mkdir(Schema.project_path + Schema.contracts,callback);
                fs.mkdir(Schema.project_path + Schema.migration,callback);
                fs.mkdir(Schema.project_path + Schema.test,callback);
                fs.mkdir(Schema.project_path + Schema.accounts,callback);
                fs.mkdir(Schema.project_path + Schema.transactions,callback);

                fulfil();
            }
            catch(ex){
                console.log(ex);
                reject(ex);
            }
    });
    },

    listContracts: function() {
        return new promise(function (fulfil,reject){
            var dir = require("node-dir");
            var path = require("path");
            try{
                let dirPath = Schema.project_path + Schema.contracts;
                dir.files(dirPath, function(err, files) {
                    if (err) reject(err);
                      
                    files = files.filter(function(file) {
                        return path.extname(file) == ".sol" && path.basename(file)[0] != ".";                
                    });
                    if(files.length ==0)
                        reject("There is no .sol file in this directory!!");
    
                    fulfil(files);
                });
            }
            catch(ex){
                reject(ex);
            }
        });           
    },

    getContractsNames: function() {        
        return new promise(function (fulfil,reject){
            var dir = require("node-dir");
            var path = require("path");
            try{                
                let dirPath = Schema.project_path + Schema.contracts;
                dir.files(dirPath, function(err, files) {
                    if (err) reject(err);
                      
                    files = files.filter(function(file) {
                        return path.extname(file) == ".sol" && path.basename(file)[0] != ".";                                      
                    });

                    if(files.length ==0) 
                        reject("There is no sol file in this directory!!");

                    for(var i=0 ; i< files.length ; i++)
                        files[i] = path.parse(files[i]).name;

                    fulfil(files);
                });
            }
            catch(ex){
                reject(ex);
            }

        });       
    }
}
module.exports = {ProjectSchema,Schema};
