var RpcInfo = require('burrow-rpcinfo')
var fs = require('fs')
var path = require('path')
var schema = require('./schema').Schema
var Promise = require('promise')
var rpcInfo = null

module.exports = class Accounts {
  constructor(burrow_url) {
    rpcInfo = new RpcInfo(burrow_url)
  }

  getAccounts() {
    return new Promise(function (resolve, reject) {
      console.log("Accounts");
      rpcInfo.getAccounts((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  createAccount(pass_phrase) {
    return new Promise(function (resolve, reject) {
      rpcInfo.genPrivAccount(pass_phrase, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getBalance(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.Balance)
        } else {
          reject(error)
        }
      })
    })
  }

  getAccountInfo(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getSequence(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.Sequence)
        } else {
          reject(error)
        }
      })
    })
  }

  getBalance(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.Balance)
        } else {
          reject(error)
        }
      })
    })
  }

  getPermissions(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.Permissions)
        } else {
          reject(error)
        }
      })
    })
  }

  getStorageRoot(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.StorageRoot)
        } else {
          reject(error)
        }
      })
    })
  }

  getCode(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getAccount(address, (error, data) => {
        if (data) {
          resolve(data.Account.Code)
        } else {
          reject(error)
        }
      })
    })
  }

  getDumpStorage(address) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getDumpStorage(address, (error, data) => {
        if (data) {
          resolve(data.Account.Code)
        } else {
          reject(error)
        }
      })
    })
  }

  getStorage(address, key) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getStorage(address, key, (error, data) => {
        if (data) {
          resolve(data.Account.Code)
        } else {
          reject(error)
        }
      })
    })
  }

  getDefaultAccounts() {
    return new Promise(function (resolve, reject) {
      try {
        let filePath = process.env.HOME + "/burrow/.keys/data";
        console.log('Key files path: \n' + filePath)
        fs.readdir(filePath, function(err, items) {               
          for (var i=0; i<items.length; i++) {
              console.log(fs.readFileSync(filePath+'/'+items[i], 'utf8'));
          }
      });
      } catch (ex) {
        reject(ex)
      }
    })
  }
}