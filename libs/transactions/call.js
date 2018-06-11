'use strict'

var Transaction = require('./transaction');
var Accounts    = require('../accounts');
var Blockchain  = require('../blockchain');

const CALL_TRANSACTION_TYPE = 2;
//{"chain_id":"BurrowChain_2A0FC2-4F8BA9","tx":[2,{"address":"<nil>","data":"9888888888888888888888888888","fee":10,"gas_limit":1000,"input":{"address":"6AE5EF855FE4F3771D1B6D6B73E21065ED7670EC","amount":10,"sequence":29}}]}
module.exports = class CallTx extends Transaction {

    constructor(connectionURL) {   
        super(connectionURL);
    }

    broadcast(privKey,gasLimit,fee,data){
        let account = this.generateAccount(privKey);
        let accounts = new Accounts(this.connectionUrl);
        let _this = this;

        return accounts.getSequence(account.address).then(sequence => {            
            let blockchain = new Blockchain(_this.connectionUrl);
            return blockchain.getChainId().then(chainId => {
                let callSign = {
                    chain_id:chainId,
                    tx: [
                    CALL_TRANSACTION_TYPE,
                    {
                        input:
                        { 
                            address:account.address,//source address
                            amount:fee,
                            sequence:sequence,// sequence of the source account
                        },
        
                        address:"<nil>", 
                        gas_limit:gasLimit,
                        fee:fee,    
                        data:data
                    }
                  ]
                };
                
                let signature = _this.sign(account.privKey,JSON.stringify(callSign));
                        
                let callTx = [
                    CALL_TRANSACTION_TYPE,
                    {
                        input:
                        { 
                            address:account.address,
                            amount:fee,
                            sequence:sequence,
                            signature:[1,signature],
                            public_key:[1,account.pubKey]
                        },
        
                        address:null, 
                        gas_limit:gasLimit,
                        fee:fee,    
                        data:data
                    }
                ];

                return _this.broadcastTx(callTx).then(data => {                    
                    return data;

                }).catch(ex => {
                    console.log(ex);               
                    throw ex;                             
                });

            }).catch(ex => {
                console.log(ex);               
                throw ex;                                 
            });

        }).catch(ex => {
            console.log(ex);                   
            throw ex;
        });
    }

}