'use strict'

var Transaction     = require('./transaction');
var Accounts        = require('../accounts');
var Blockchain      = require('../blockchain');
const BOND_TX_TYPE  = 0x11;

module.exports = class BondTx extends Transaction {

    constructor(connectionURL) {   
        super(connectionURL);
    }
  
    broadcast(privKey,address,amount,fee,pubKey){

        let account  = this.generateAccount(privKey);
        let accounts = new Accounts(this.connectionUrl);
        let _this    = this;

        return accounts.getSequence(account.address).then(sequence => {            
            let blockchain = new Blockchain(_this.connectionUrl);
            
            return blockchain.getChainId().then(chainId => {
                let formatedPubKey = "{{PubKeyEd25519{"+ pubKey+'}}}';
                let bondSign = {
                    chain_id:chainId,
                    tx: [
                    BOND_TX_TYPE,
                    {
                        from:                    
                        { 
                            address:account.address,
                            amount:amount,
                            sequence:sequence + 1,
                        },

                        to:                    
                        {
                            address:address,
                            amount:amount
                        },

                        pubKey:formatedPubKey
                    }
                    ]
                };
                
                let signature = _this.sign(account.privKey,JSON.stringify(bondSign));
                        
                let bondTx = [
                    BOND_TX_TYPE,
                    {
                        from:                    
                        { 
                            address:account.address,
                            amount:amount,
                            sequence:sequence + 1,
                            signature:[1,signature],
                            public_key:[1,account.pubKey]
                        },

                        to:                    
                        {
                            address:address,
                            amount:amount
                        },
                        
                        pubKey:[1,pubKey]   
                                        
                    }
                ];

                return _this.broadcastTx(bondTx).then(data => {                    
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