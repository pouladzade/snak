'use strict'

let contracts = require('burrow-contracts')
const schema = require('./schema').Schema
var fs = require('fs')
var promise = require('promise')

var methodCallBack = function (error, result) {
  if (error) {
    console.log('[Error]:\n' + error.toString())
  } else {
    console.log(JSON.stringify(result, null, 4))
  }
}

module.exports = class Functions {
  constructor () {
    var Project = require('./project')
    this.project = new Project()
  }

  _getContractAddress (contract_name) {
    let deploy_obj = fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contract_name + '.json', 'utf8')

    if (deploy_obj) { return deploy_obj.address } else { return null }
  }

  _getMigrateObj (contract_name, function_name) {
    let _this = this
    return new promise(function (fulfil, reject) {
      _this.project.getContractsNames().then((contracts) => {
        try {
          for (let i = 0; i < contracts.length; i++) {
            if (contract_name == contracts[i]) {
              let migrate_obj = JSON.parse(fs.readFileSync(schema.project_path + schema.migration + schema.migration_output + contracts[i] + '.json', 'utf8'))
              for (let j = 0; j < migrate_obj.abi.length; j++) {
                let element = migrate_obj.abi[j]
                if (element.type == 'function' && element.name == function_name) { fulfil({ abi: migrate_obj.abi, address: migrate_obj.address }) }
              }
            }
          }
          reject(null)
        } catch (ex) {
          console.log(ex)
        }
      }).catch(err => {
        console.log(err)
      })
    })
  }

  callFunction (burrow_URL, contract_name, function_name, input) {
    var _this = this
    this._getMigrateObj(contract_name, function_name).then((migrate_object) => {
      try {
        let account_path = schema.project_path + schema.accounts + schema.default_account
        let contractManager = contracts.newContractManagerDev(burrow_URL, JSON.parse(fs.readFileSync(account_path, 'utf-8')))
        let ContractFactory = contractManager.newContractFactory(migrate_object.abi)

        ContractFactory.at(migrate_object.address, function (error, contract) {
          if (error) {
            throw error
          }
          let contract_function = 'contract.' + function_name + '( ' + input + ', methodCallBack ' + ' )'

          var Func = new Function('contract', 'methodCallBack', contract_function)
          Func(contract, methodCallBack)
        })
      } catch (ex) {
        console.log(ex)
      }
    }).catch(err => {
      console.log(err)
    })
  }
}
