
'use strict'

let contracts = require('@monax/legacy-contracts');
const schema = require('./init').Schema;
var projectSchema = require("./init").ProjectSchema;
var fs = require('fs');
var promise = require("promise");

function methodCallBack(error, result) {
    if (error) {
        console.log("[Error]:\n" + error.toString());
    }
    else {
        console.log(JSON.stringify(result,null,4));
    }
}

function getContractAddress(contract_name) {
    let deploy_obj = fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contract_name + ".json", "utf8");

    if (deploy_obj)
        return deploy_obj.address;
    else
        return null;
}

function getMigrateObj(contract_name, function_name) {
    return new promise(function (fulfil, reject) {
        projectSchema.getContractsNames().then((contracts) => {
            try {
                for (let i = 0; i < contracts.length; i++) {
                    if (contract_name == contracts[i]) {
                        let migrate_obj = JSON.parse(fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contracts[i] + ".json", "utf8"));
                        for (let j = 0; j < migrate_obj.abi.length; j++) {
                            let element = migrate_obj.abi[j];
                            if (element.type == "function" && element.name == function_name)
                                fulfil({ abi: migrate_obj.abi, address: migrate_obj.address });
                        }
                    }
                }
                reject(null);
            }

            catch (ex) {
                console.log(ex);
            }
        }).catch(err=>{
            console.log(err);

        });
    });
}


function callFunction(burrow_URL, contract_name, function_name, input) {

    getMigrateObj(contract_name, function_name).then((migrate_object) => {

        try {
            let account_path = schema.project_path + schema.accounts + schema.default_account;
            let contractManager = contracts.newContractManagerDev(burrow_URL, JSON.parse(fs.readFileSync(account_path, 'utf-8')));
            let ContractFactory = contractManager.newContractFactory(migrate_object.abi);

            ContractFactory.at(migrate_object.address, function (error, contract) {
                if (error) {
                    throw error;
                }
                let contract_function = "contract." + function_name + "( " + input + ", methodCallBack " + " )";

                var Func =new Function ("contract", "methodCallBack",contract_function);
                Func(contract,methodCallBack);
            });
        }
        catch (ex) {
            console.log(ex);
        }
    }).catch(err=>{
        console.log(err);

    });
}

module.exports = { callFunction };