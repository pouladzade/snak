'use strict'

var RpcInfo = require('burrow-rpcinfo')
var Promise = require('promise')
var rpcInfo

module.exports = class Blockchain {
  constructor(burrow_url) {
    rpcInfo = new RpcInfo(burrow_url)
  }

  getGenesis() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getGenesis((error, data) => {
        if (data) {
          resolve(JSON.stringify(data, null, 4))
        } else {
          reject(error)
        }
      })
    })
  }

  getChainId() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getChainId((error, data) => {
        if (data) {
          resolve(data.ChainId)
        } else {
          reject(error)
        }
      })
    })
  }

  getNetworkInfo() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getNetworkInfo((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getChainInfo() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getChainId((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getBlock(height) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getBlock(height, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getStatus(block_time_within, block_seen_time_within) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getStatus(block_time_within, block_seen_time_within, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getValidators() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getValidators((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getConsensus() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getConsensus((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getName(name) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getName(name, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getNames() {
    return new Promise(function (resolve, reject) {
      rpcInfo.getNames((error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getUnconfirmedTxs(maxTxs) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getUnconfirmedTxs(maxTxs, (error, data) => {
        if (data) {
          resolve(data)
        } else {
          reject(error)
        }
      })
    })
  }

  getBlockTxsNo(height) {
    return new Promise(function (resolve, reject) {
      rpcInfo.getBlock(height, (error, data) => {
        if (data) {
          resolve(data.ResultBlock.block.header.num_txs)
        } else {
          reject(error)
        }
      })
    })
  }
}