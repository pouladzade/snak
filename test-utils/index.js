'use strict'
var fs          = require('fs');
var Logger      = require('../libs/logger');
let contracts   = require('burrow-contracts');
var fs          = require('fs');
var promise     = require("promise");
const schema    = require('../libs/schema').Schema;
var ContractFactory;
var myExistingContract;
var config; 

module.exports = class test_utils {

    constructor() {        
        try{
            let config_path =  process.cwd() + "/config.json";
            if (fs.existsSync(config_path)) {
                let content = fs.readFileSync(config_path);
                config = JSON.parse(content);
            }

            if(config == undefined) {
                config = {
                    config_name:"config.json",
                    burrow_url:"http://localhost:1337/rpc",
                    burrow_path:"$HOME/burrow"
                }
            }
            this._Config   = config;  
            var Project = require("../libs/project");
            this.project = new Project;

        }catch(ex){
            console.log(ex);
        }          
    }
      
    getContractAddress(contract_name) {
        let deploy_obj = fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contract_name + ".json", "utf8");
        if (deploy_obj)
            return JSON.parse(deploy_obj).address;
        else
            return null;
    }

    getMigrateObj(contract_name) {
        let _this = this;
        return new Promise (function(fulfil,reject){
            _this.project.getContractsNames().then((contractsObj) => {
                try {
                    for(let i=0; i< contractsObj.length; i++) {
                        if(contract_name ==contractsObj[i]) {
                            let migrate_obj = JSON.parse(fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contractsObj[i] + ".json", "utf8"));
                            fulfil({ abi: migrate_obj.abi, address: migrate_obj.address });
                        }
                    }

                } catch (ex) {
                    reject('The contract was not deployed')
                    console.log(ex)
                }
            })
        }).catch((err) => {
            console.log(err);
        })
    }

    getContractFactory(contract_name) {
        let _this = this;
        return new promise(function (resolve, reject) {
            _this.getMigrateObj(contract_name).then((migrate_obj) => {
                try {
                    let account_path = schema.project_path + schema.accounts +schema.default_account;
                    let contractManager = contracts.newContractManagerDev(_this._Config.burrow_url, JSON.parse(fs.readFileSync(account_path, 'utf-8')));
                    ContractFactory = contractManager.newContractFactory(migrate_obj.abi)
                    ContractFactory.at(migrate_obj.address, function(error, contract){
                        if (error) {
                            reject('This contract is not dpeloyed');
                        }
                            myExistingContract = contract;
                    });
                    resolve(myExistingContract);

                 } catch (ex) {
                    console.log(ex)
                 }
            })
        });
    }
}
