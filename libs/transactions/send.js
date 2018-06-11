'use strict'

var Transaction     = require('./transaction');
var Accounts        = require('../accounts');
var Blockchain      = require('../blockchain');
const SEND_TX_TYPE  = 0x1;

module.exports = class SendTx extends Transaction {

    constructor(connectionURL) {   
        super(connectionURL);
    }
  
    broadcast(privKey,address,amount){
        let account  = this.generateAccount(privKey);
        let accounts = new Accounts(this.connectionUrl);
        let _this    = this;

        return accounts.getSequence(account.address).then(sequence => {            
            let blockchain = new Blockchain(_this.connectionUrl);

            return blockchain.getChainId().then(chainId => {
                let sendSign = {
                    chain_id:chainId,
                    tx: [
                    SEND_TX_TYPE,
                    {
                        inputs:
                        [
                            { 
                                address:account.address,
                                amount:amount,
                                sequence:sequence + 1,
                            }
                        ],
                        outputs:
                        [
                            {
                                address:address,
                                amount:amount
                            }
                        ]
                    }
                    ]
                };
                
                let signature = _this.sign(account.privKey,JSON.stringify(sendSign));
                        
                let sendTx = [
                    SEND_TX_TYPE,
                    {
                        inputs:
                        [
                            { 
                                address:account.address,
                                amount:amount,
                                sequence:sequence + 1,
                                signature:[1,signature],
                                public_key:[1,account.pubKey]
                            }
                        ],
                        outputs:
                        [
                            {
                                address:address,
                                amount:amount
                            }
                        ]
                    }
                ];

                return _this.broadcastTx(sendTx).then(data => {                    
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