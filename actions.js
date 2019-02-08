
'use strict'

var os = require('os')
var Logger = require('./libs/logger')
var logger = new Logger()

module.exports = class Action {
  constructor (config) {
    if (config == undefined) {
      this._Config = {

        rpc:{
          info:"http://localhost:1337/rpc",
          grpc:"127.0.0.1:10997",
          metrics:"tcp://127.0.0.1:9102",
          profiler:"tcp://127.0.0.1:6060"
        },
      
        burrow_path:"$HOME/burrow",
        
        default_account:""
      }
    } else {
      this._Config = config
    }

    this._blockchain = null
    this._unsafeTx = null
    this._sendTx = null
    this._callTx = null
    this._bondTx = null
    this._unbondTx = null
    this._accounts = null
    this._compile = null
    this._project = null
    this._functions = null
  }

  _unsafeTxHandler () {
    if (this._unsafeTx != null) {
      return this._unsafeTx
    } else {
      let Unsafe = require('./libs/transactions/unsafe')
      this._unsafeTx = new Unsafe(this._Config.rpc.grpc)
      return this._unsafeTx
    }
  }

  _sendTxHandler () {
    if (this._sendTx != null) {
      return this._sendTx
    } else {
      let SendTx = require('./libs/transactions/send')
      this._sendTx = new SendTx(this._Config.rpc.grpc)
      return this._sendTx
    }
  }

  _callTxHandler () {
    if (this._callTx != null) {
      return this._callTx
    } else {
      let CallTx = require('./libs/transactions/call')
      this._callTx = new CallTx(this._Config.rpc.grpc)
      return this._callTx
    }
  }

  _bondTxHandler () {
    if (this._bondTx != null) {
      return this._bondTx
    } else {
      let BondTx = require('./libs/transactions/bond')
      this._bondTx = new BondTx(this._Config.rpc.grpc)
      return this._bondTx
    }
  }

  _unbondTxHandler () {
    if (this._unbondTx != null) {
      return this._unbondTx
    } else {
      let UnbondTx = require('./libs/transactions/unbond')
      this._unbondTx = new UnbondTx(this._Config.rpc.grpc)
      return this._unbondTx
    }
  }

  _accountHandler () {
    if (this._accounts != null) {
      return this._accounts
    } else {
      let Accounts = require('./libs/accounts')
      this._accounts = new Accounts(this._Config.rpc.info)
      return this._accounts
    }
  }

  _compileHandler () {
    if (this._compile != null) {
      return this._compile
    } else {
      let Compile = require('./libs/compile')
      this._compile = new Compile()
      return this._compile
    }
  }

  _projectHandler () {
    if (this._project != null) {
      return this._project
    } else {
      let Project = require('./libs/project')
      this._project = new Project()
      return this._project
    }
  }

  _blockchainHandler () {
    if (this._blockchain != null) {
      return this._blockchain
    } else {
      let Blockchain = require('./libs/blockchain')
      this._blockchain = new Blockchain(this._Config.rpc.info)
      return this._blockchain
    }
  }

  _deployHandler () {
    if (this.deploy != null) {
      return this.deploy
    } else {
      let Deploy = require('./libs/deploy')
      this.deploy = new Deploy(this._Config.rpc.grpc)
      return this.deploy
    }
  }

  _functionHandler () {
    if (this._functions != null) {
      return this._functions
    } else {
      let Functions = require('./libs/functions')
      this._functions = new Functions()
      return this._functions
    }
  }

  getConfig () {
    try {
      logger.console(JSON.stringify(this._Config, null, 4))
      return this._Config
    } catch (ex) {
      logger.error(ex)
    }
  }

  compileAll () {
    try {
      this._compileHandler().compileAll()
    } catch (ex) {
      logger.error(ex)
    }
  }

  migrate (accountName, isForce) {
    try {
      let Link = require('./libs/link')
      let linker = new Link()
      var _this = this
      linker.getDeployOrder().then(function (linkOrder) {
        try {
          _this._deployHandler().deployAll(linkOrder, accountName, isForce)
        } catch (ex) {
          logger.error(ex)
        }
      }).catch(err => {
        logger.error(err)
      })
    } catch (ex) {
      logger.error(ex)
    }
  }

  transact (privateKey, data, address, fee, gasLimit, unsafe) {
    if (unsafe === true) {
      this._unsafeTxHandler().transact(privateKey, data, address, fee, gasLimit).then(data => {
        logger.console(JSON.stringify(data, null, 4))
      })
        .catch(function (ex) {
          logger.error(JSON.stringify(ex, null, 4))
        })
    } else {
      this.broadcastCall(privateKey, data, address, fee, gasLimit)
    }
  }

  send (privateKey, address, amount, unsafe) {
    if (unsafe === true) {
      this._unsafeTxHandler().send(privateKey, address, amount).then(data => {
        logger.console(JSON.stringify(data, null, 4))
      })
        .catch(function (ex) {
          logger.error(JSON.stringify(ex, null, 4))
        })
    } else {
      this.broadcastSend(privateKey, address, amount)
    }
  }

  bond (privateKey, address, amount, fee, pubKey, unsafe) {
    if (unsafe === true) {
      this._unsafeTxHandler().bond(privateKey, address, amount, fee, pubKey).then(data => {
        logger.console(JSON.stringify(data, null, 4))
      })
        .catch(function (ex) {
          logger.error(JSON.stringify(ex, null, 4))
        })
    } else {
      this.broadcastBond(privateKey, address, amount, fee, pubKey)
    }
  }

  unbond (privateKey, address, amount, fee, unsafe) {
    if (unsafe === true) {
      this._unsafeTxHandler().unbond(privateKey, address, amount, fee).then(data => {
        logger.console(JSON.stringify(data, null, 4))
      })
        .catch(function (ex) {
          logger.error(JSON.stringify(ex, null, 4))
        })
    } else {
      this.broadcastUnbond(privateKey, address, amount, fee)
    }
  }

  randomTransact (count) {
    try {
      this._unsafeTxHandler().randomTransact(count, logger)
    } catch (ex) {
      logger.error(ex)
    }
  }

  loadAccounts () {
    this._accountHandler().getAccounts()
      .then(accounts => {
        logger.console('accounts :\n' + JSON.stringify(accounts, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }
  getAccountInfo (acc) {
    this._accountHandler().getAccountInfo(acc)
      .then(accounts => {
        logger.console('accounts :\n' + JSON.stringify(accounts, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }
  
  getDefaultAccounts () {
    this._accountHandler().getDefaultAccounts()
      .then(accounts => {
        logger.console('Default accounts :\n' + JSON.stringify(accounts, null, 4))
      })
      .catch(function (ex) {
        logger.error(ex)
      })
  }

  createAccount (passPhrase) {
    this._accountHandler().createAccount(passPhrase)
      .then(account => {
        logger.console('Account :\n' + JSON.stringify(account, null, 4))
      })
      .catch(function (ex) {
        logger.error(ex)
      })
  }

  getBalance (address, cmd) {
    console.log(cmd)
    this._accountHandler().getBalance(address)
      .then(balance => {
        logger.console('Balance : ' + balance)
      })
      .catch(function (ex) {
        logger.error(ex)
      })
  }

  getSequence (address) {
    this._accountHandler().getSequence(address)
      .then(sequence => {
        logger.console('Sequence : ' + sequence)
      })
      .catch(function (ex) {
        logger.error(ex)
      })
  }

  init () {
    try {
      this._projectHandler().createSchema()
    } catch (ex) {
      logger.error(ex)
    }
  }

  burrow () {
    try {
      let shell = require('shelljs')
      let cmd = __dirname + '/binaries/burrow.sh'
      let child = shell.exec(cmd, { async: true })
      child.stdout.on('data', function (data) {
      })
    } catch (ex) {
      logger.error(ex)
    }
  }

  installBurrow () {
    let osType = os.type().toLowerCase()

    if (osType !== 'linux' && osType !== 'darwin') {
      logger.console('snak does not support your OS type: ' + os.type())
      return
    }
    try {
      let shell = require('shelljs')
      let cmd = __dirname + '/binaries/install.sh ' + osType
      let child = shell.exec(cmd, { async: true })
      child.stdout.on('data', function (data) {
      })
    } catch (ex) {
      logger.error(ex)
    }
  }

  uninstallBurrow () {
    try {
      let shell = require('shelljs')
      let cmd = __dirname + '/binaries/uninstall.sh'
      let child = shell.exec(cmd, { async: true })
      child.stdout.on('data', function (data) {
      })
    } catch (ex) {
      logger.error(ex)
    }
  }

  callFunction (contract_name, function_name, parameters_list) {
    try {
      this._functionHandler().callFunction(this._Config.burrow_url, contract_name, function_name, parameters_list)
    } catch (ex) {
      logger.error(ex)
    }
  }

  getChainId () {
    return this._blockchainHandler().getChainId()
      .then(chainId => {
        logger.console('Chain ID :\n' + JSON.stringify(chainId, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getGenesisHash () {
    return this._blockchainHandler().getGenesis()
      .then(genesisHash => {
        logger.console('Genesis Hash :\n' + genesisHash)
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getInfo () {
    return this._blockchainHandler().getInfo()
      .then(info => {
        logger.console('info block :\n' + JSON.stringify(info, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getNetworkInfo() {
    return this._blockchainHandler().getNetworkInfo()
      .then(info => {
        logger.console('info block :\n' + JSON.stringify(info, null, 4).toLowerCase())
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getLatestBlock () {
    return this._blockchainHandler().getLatestBlock()
      .then(block => {
        logger.console('Latest block :\n' + JSON.stringify(block, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }
  
  getConsensusInfo () {
    return this._blockchainHandler().getConsensus()
      .then(data => {
        logger.console('Consensus :\n' + JSON.stringify(data, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getLatestBlockHeight () {
    return this._blockchainHandler().getLatestBlockHeight()
      .then(latestBlockHeight => {
        logger.console('Ltest block height :' + latestBlockHeight)
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getBlock (height) {
    return this._blockchainHandler().getBlock(height)
      .then(block => {
        logger.console('block :\n' + JSON.stringify(block, null, 4))
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getBlockTxs (height) {
    return this._blockchainHandler().getBlockTxs(height)
      .then(txs => {
        logger.console('block :\n' + JSON.stringify(txs, null, 4))
        return txs
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  getBlockTxsNo (height) {
    return this._blockchainHandler().getBlockTxsNo(height)
      .then(txNo => {
        return ({ txNo: txNo, height: height })
        // logger.console("Tx Number :\n" + JSON.stringify(block,null,4));
      })
      .catch(ex => {
        logger.error(ex)
      })
  }

  broadcastSend (privKey, address, amount) {
    return this._sendTxHandler().broadcast(privKey, address, amount).then(data => {
      logger.console('Safe Send Tx result :\n' + JSON.stringify(data, null, 4))
    }).catch(ex => {
      logger.error(ex)
    })
  }

  broadcastCall (privKey, address, gasLimit, fee, data) {
    return this._callTxHandler().broadcast(privKey, address, gasLimit, fee, data).then(data => {
      logger.console('Safe Transact Tx result :\n' + JSON.stringify(data, null, 4))
    }).catch(ex => {
      logger.error(ex)
    })
  }

  broadcastBond (privKey, address, amount, fee, pubKey) {
    return this._bondTxHandler().broadcast(privKey, address, amount, fee, pubKey).then(data => {
      logger.console('Safe Bond Tx result :\n' + JSON.stringify(data, null, 4))
    }).catch(ex => {
      logger.error(ex)
    })
  }

  broadcastUnbond (privKey, address, amount, fee) {
    return this._unbondTxHandler().broadcast(privKey, address, amount, fee).then(data => {
      logger.console('Safe Unbond Tx result :\n' + JSON.stringify(data, null, 4))
    }).catch(ex => {
      logger.error(ex)
    })
  }

  getChainTxs (from, to) {
    var _this = this
    for (var i = from; i < to; i++) {
      this.getBlockTxsNo(i).then((data) => {
        console.log('No ' + data.height + ' ) ' + data.txNo)
        if (data.txNo > 0) {
          _this.getBlockTxs(data.height).then(txs => {
            console.log(data.height + ') \n' + JSON.stringify(txs, null, 4))
          })
        }
      })
    }
  }
}
