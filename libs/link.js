'use strict'
var promise = require("promise");
const TopologicalSort = require('topological-sort');
const schema = require('./init').Schema;
var projectSchema = require("./init").ProjectSchema;
var fs = require('fs');

var LinkOrder = function(linkOrder,contractName, dependencies) {
    this.linkOrder    = linkOrder;
    this.contractName = contractName;
    this.dependencies = dependencies;
    this.address      = "";
    this.byteCodeHash = "";
}

module.exports = class Linker {

   getDeployOrder(){ 
    var _this = this;
    return new promise(function (fulfil,reject){
        var contractNames= [];        
        var contractArtifacts;
        const nodes = new Map();
        projectSchema.getContractsNames().then(function(contractNames){    
            try{
                for(let i=0 ; i< contractNames.length ; i++){
                    let contract = contractNames[i];  
                    let artifact_obj = JSON.parse(fs.readFileSync(schema.project_path + schema.build + '/' + contract + '.json','utf-8'));
                    let bytecode     = artifact_obj.bytecode;
                    let dependencies = [];
                    for(let j=0 ; j< contractNames.length ; j++){
                        if(bytecode.indexOf(contractNames[j]) > -1) {
                            dependencies.push(contractNames[j]);                            
                        }  
                    } 
                    nodes.set(contract,dependencies);                                   
                }                                  
                let linkOrder = _this.makeDeploymentOrder(nodes,contractNames);                  
                if(linkOrder) fulfil(linkOrder);
                else throw new (" Error : can not create link order list!!!");                    
            }
            catch(ex){
                console.log(ex);
                reject(ex);
            }
            
        });
    });        
        
    };

    makeDeploymentOrder(nodes,contractNames){
        try{
            const sortContracts = new TopologicalSort(nodes);
            for(let i=0 ; i< contractNames.length ; i++) {
                let contract = contractNames[i];
                let dependencies = nodes.get(contract);                
                if(dependencies){
                    for(let j=0 ;  j< dependencies.length ; j++) {                   
                        sortContracts.addEdge(dependencies[j],contract);
                    }
                }       
            }
            
            let sorted = sortContracts.sort();  
            let link_order=[];
            let order = 1;
            for(var element of sorted){              
                var contractObj = new LinkOrder(order,element[0],element[1]);
                link_order.push(contractObj);
                order++;
            }          
           
            return link_order;
        }
        catch(ex){
            console.log(ex);        
        }
    
    };

    link(contract_name,dependencies,link_order){
        try{
            let contract_obj = JSON.parse(fs.readFileSync(schema.project_path + schema.build + '/' + contract_name + '.json','utf-8'));
            
            let byteCode = contract_obj.bytecode.slice(2,);
            for(let i=0 ; i< dependencies.length ; i++){                
                byteCode = this.putDependencyAddress(byteCode,this.getContractAddress(dependencies[i],link_order),dependencies[i]);
            }            
            return byteCode;
        }
        catch(ex){
            console.log(ex); 
        }

    };

    getContractAddress(contract_name,link_order){
        for(let i = 0 ; i < link_order.length ; i++){            
            if(link_order[i].contractName == contract_name)
                return link_order[i].address;        
        }
        console.log("[Error] : Can not find the contract in link order list  : " + contract_name); 
    };

    putDependencyAddress(byteCode,address,name){
        try{
            let addrr = "__" + name + "________________________________________";
            
            addrr = addrr.slice(0,40);
            byteCode = byteCode.replace(addrr,address);
            return byteCode;
        }
        catch(ex){
            console.log(ex); 
        }
 
    };

}
