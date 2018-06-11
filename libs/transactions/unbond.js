'use strict'

var Transaction = require('./transaction');
var Accounts    = require('../accounts');
var Blockchain  = require('../blockchain');
const UNBOND_TX_TYPE = 0x12;

 module.exports = class UnbondlTx extends Transaction {

    constructor(connectionURL) {   
      super(connectionURL);
    }

  
    broadcast(privKey,address,amount,fee){

    let account  = this.generateAccount(privKey);
    let accounts = new Accounts(this.connectionUrl);
    let _this    = this;

    return accounts.getSequence(account.address).then(sequence => {            
        let blockchain = new Blockchain(_this.connectionUrl);
        
        return blockchain.getChainId().then(chainId => {
            let unbondSign = {
                chain_id:chainId,
                tx: [
                UNBOND_TX_TYPE,
                {
                    from:                    
                    { 
                        address:account.address,
                        amount:amount,
                        sequence:sequence + 2,
                    },

                    to:                    
                    {
                        address:address,
                        amount:amount
                    },
                }
                ]
            };
            
            let signature = _this.sign(account.privKey,JSON.stringify(unbondSign));
                    
            let unbondTx = [
                UNBOND_TX_TYPE,
                {
                    from:                    
                    { 
                        address:account.address,
                        amount:amount,
                        sequence:sequence + 2,
                        signature:[1,signature],
                        public_key:[1,account.pubKey]
                    },

                    to:                    
                    {
                        address:address,
                        amount:amount
                    },
                }
            ];

            return _this.broadcastTx(unbondTx).then(data => {                    
                return data;

            }).catch(ex => {
                throw ex;                    
            });

        }).catch(ex => {
            throw ex;             
        });

    }).catch(ex => {
        throw ex;
    });

    }
}