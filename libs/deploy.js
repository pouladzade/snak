
'use strict'

let contracts = require('burrow-contracts')
var fs = require('fs')
const schema = require('./schema').Schema
var Linker = require('./link')
var md5 = require('md5')

var Link = new Linker()
let project_path = schema.project_path
let counter = 0
let contractManager = null
let linkOrder = null
let byteCodeHash = ''
let prevLinkOrder = null

module.exports = class Deploy {
  constructor (connectionUrl) {
    this.connectionUrl = connectionUrl
  }

  _deployCallb (error, contract) {
    try {
      if (error) {
        console.log("Error : Contract didn't deploy!!!!!!!!.")
      } else {
        let str = JSON.stringify(contract, null, 4)
        linkOrder[counter].byteCodeHash = byteCodeHash
        linkOrder[counter].address = contract.address
        let log_file = fs.createWriteStream(project_path + schema.migration + schema.migration_output + linkOrder[counter].contractName + '.json', { flags: 'w' })
        log_file.write(str, 'utf-8')
        log_file.close()
        console.log('Address : ' + contract.address + '\n')
        console.log(linkOrder[counter].contractName + ' has been successfully deployed! \n')
        counter++

        if (linkOrder.length > counter) { deploy() } else { Deploy._saveLinkOrder() }
      }
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }

  deployAll (link_order, account_name, isForce) {
    try {
      let account_path
      let link_order_path = schema.project_path + schema.build + schema.link_order_file
      if (fs.existsSync(link_order_path)) {
        prevLinkOrder = JSON.parse(fs.readFileSync(link_order_path, 'utf-8'))
      }

      linkOrder = link_order
      if (!account_name) account_path = project_path + schema.accounts + schema.default_account
      else account_path = project_path + schema.accounts + '/' + accountName

      contractManager = contracts.newContractManagerDev(this.connectionUrl, JSON.parse(fs.readFileSync(account_path, 'utf-8')))
      this._deploy(isForce)
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }

  _deploy (isForce) {
    try {
      console.log(counter + 1 + ')' + this._createDependencyString() + '\n')
      let byte_code = Link.link(linkOrder[counter].contractName, linkOrder[counter].dependencies, linkOrder)

      if (isForce || this._hasContractChanged(byte_code, linkOrder[counter].contractName)) {
        console.log(byte_code + '\n')
        let contract_obj = JSON.parse(fs.readFileSync(project_path + schema.build + '/' + linkOrder[counter].contractName + '.json', 'utf-8'))
        let ContractFactory = contractManager.newContractFactory(contract_obj.abi)
        byteCodeHash = md5(byte_code)
        ContractFactory.new({ data: byte_code }, this._deployCallb)
      } else {
        console.log('There is no changes in ' + linkOrder[counter].contractName + '\n')
        counter++

        if (linkOrder.length > counter) { this._deploy() } else { Deploy._saveLinkOrder() }
      }
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }

  _createDependencyString () {
    try {
      let str = linkOrder[counter].contractName + '  :  '
      for (let i = 0; i < linkOrder[counter].dependencies.length; i++) { str += ' => ' + linkOrder[counter].dependencies[i] }

      return str
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }

  _hasContractChanged (byte_code, contract_name) {
    try {
      if (prevLinkOrder == null) {
        return true
      }
      let byte_code_hash = md5(byte_code)
      for (let i = 0; i < prevLinkOrder.length; i++) {
        if (prevLinkOrder[i].contractName == contract_name && prevLinkOrder[i].byteCodeHash == byte_code_hash) {
          linkOrder[counter].address = prevLinkOrder[i].address
          linkOrder[counter].byteCodeHash = byte_code_hash
          return false
        }
      };
      return true
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }

  static _saveLinkOrder () {
    try {
      let str_link_order = JSON.stringify(linkOrder, null, 4)
      let link_file = fs.createWriteStream(schema.project_path + schema.build + schema.link_order_file, { flags: 'w' })
      link_file.write(str_link_order, 'utf-8')
      link_file.close()
    } catch (ex) {
      console.log(ex)
      throw ex
    }
  }
}
