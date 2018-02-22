
var fs = require("fs");
var path = require("path");
var compile = require("truffle-compile");
var assert = require("assert");
var projectSchema = require("./init").ProjectSchema;
var schema = require("./init").Schema;
var Resolve = require("truffle-resolver");
var current_path = schema.project_path;


var resolverOptions =
 {
   working_directory : current_path,
   contracts_build_directory : current_path + schema.build,
 }

var compileOptions =
 {
   strict: false,
   quiet: false,
   logger: console,
   contracts_directory : current_path + schema.contracts,
   working_directory : current_path,
   contracts_build_directory : current_path + schema.build,
   solc:"solc",
   resolver:new Resolve(resolverOptions)
 }

 function callb(error,data){
    if(error){
        console.log("Error : Compile failed!");
        console.log(erroe);
    }
    else{
        console.log("Compile finished successfully!!!");
        var contracts;
        projectSchema.getContractsNames().then(function(contracts){
            if(saveArtifacts(contracts, data))
                console.log("Artifacts have been created successfully!!!");
            else
                console.log("Error : can not create artifacts.");
        });       
    }         
}

function saveArtifacts (contracts,data)
{
    for(var i = 0 ; i < contracts.length ; i++) {
        try{
            var strData = JSON.stringify(data[contracts[i]],null,4);
            if(!strData){
                    console.log("can not find the contract with this name : " + contracts[i] + "\n Please check the contract name again!");                    
            }
            var strFullName = compileOptions.contracts_build_directory;
            if (!fs.existsSync(strFullName)) {
                fs.mkdirSync(strFullName);
            }
            strFullName += "/" + contracts[i] + ".json";                       
            var file = fs.createWriteStream(strFullName, {flags : 'w'});
            file.write(strData,'utf-8');
        }
        catch(ex){
            console.log(ex);
            return false;
        }
    }
    return true;
}

function snack_compile(){
    try{
        projectSchema.listContracts()
        .then(function(files){
            console.log(files);
            var map = {};
            for(var i=0; i< files.length ; i++){
                var source = fs.readFileSync(path.join(files[i]), "utf-8");                    
                map[files[i]] = source;
            }
            compile.all(compileOptions,callb);                                            
            })
        .catch((err)=>{
                console.log(err);
        });
    }
    catch(ex){
        console.log(ex);
    }
}

module.exports = snack_compile;