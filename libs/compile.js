
var fs = require('fs')
var path = require('path')
var compile = require('truffle-compile')
var schema = require('./schema').Schema
var Resolve = require('truffle-resolver')
var Project = require('./project')

var project = new Project()

let current_path = schema.project_path

let resolverOptions = {
  working_directory: current_path,
  contracts_build_directory: current_path + schema.build
}

let compileOptions = {
  strict: false,
  quiet: false,
  logger: console,
  contracts_directory: current_path + schema.contracts,
  working_directory: current_path,
  contracts_build_directory: current_path + schema.build,
  solc: 'solc',
  resolver: new Resolve(resolverOptions)
}

module.exports = class Compile {
  constructor () {

  }

  static _callb (error, data) {
    if (error) {
      console.log('Error : Compile failed!')
      console.log(error)
    } else {
      console.log('Compile finished successfully!!!')

      var contracts
      project.getContractsNames().then(function (contracts) {
        if (Compile._saveArtifacts(contracts, data)) { console.log('Artifacts have been created successfully!!!') } else { console.log('Error : can not create artifacts.') }
      }).catch(err => {
        console.log(err)
      })
    }
  }

  static _saveArtifacts (contracts, data) {
    for (var i = 0; i < contracts.length; i++) {
      try {
        var strData = JSON.stringify(data[contracts[i]], null, 4)
        if (!strData) {
          console.log('can not find the contract with this name : ' + contracts[i] + '\n Please check the contract name again!')
        }
        var strFullName = compileOptions.contracts_build_directory
        if (!fs.existsSync(strFullName)) {
          fs.mkdirSync(strFullName)
        }
        strFullName += '/' + contracts[i] + '.json'
        var file = fs.createWriteStream(strFullName, { flags: 'w' })
        file.write(strData, 'utf-8')
      } catch (ex) {
        console.log(ex)
        return false
      }
    }
    return true
  }

  compileAll () {
    try {
      project.listContracts()
        .then(function (files) {
          console.log(files)
          var map = {}
          for (var i = 0; i < files.length; i++) {
            var source = fs.readFileSync(path.join(files[i]), 'utf-8')
            map[files[i]] = source
          }
          compile.all(compileOptions, Compile._callb)
        })
        .catch((err) => {
          console.log(err)
        })
    } catch (ex) {
      console.log(ex)
    }
  }
}
