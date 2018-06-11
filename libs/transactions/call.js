'use strict'

var Transaction = require('./transaction');
var Accounts    = require('../accounts');
var Blockchain  = require('../blockchain');

const CALL_TX_TYPE = 0x2;
const GOLANG_NULL  = "<nil>";

module.exports = class CallTx extends Transaction {

    constructor(connectionURL) {   
        super(connectionURL);
    }

    broadcast(privKey,address,gasLimit,fee,data){
        
        let account  = this.generateAccount(privKey);
        let accounts = new Accounts(this.connectionUrl);
        let _this    = this;
        let toAddress = GOLANG_NULL; // For create contract, address MUST BE "<nil>" for signing, and must be  null for calling brodcastTx

        if(address != null && address != ""){
            toAddress = address;
        }    

        return accounts.getSequence(account.address).then(sequence => {            
            let blockchain = new Blockchain(_this.connectionUrl);
            return blockchain.getChainId().then(chainId => {
                let callSign = {
                    chain_id:chainId,
                    tx: [
                    CALL_TX_TYPE,
                    {        
                        address:toAddress,
                        data:data,
                        fee:fee,  
                        gas_limit:gasLimit,
                                                  
                        input:
                        { 
                            address:account.address,//source address
                            amount:fee,
                            sequence:sequence + 1,// sequence of the source account
                        }
                    }
                  ]
                };
                
                let signature = _this.sign(account.privKey,JSON.stringify(callSign));
                        
                let callTx = [
                    CALL_TX_TYPE,
                    {                                
                        address: (toAddress === GOLANG_NULL) ? null : toAddress , 
                        data:data,
                        fee:fee,  
                        gas_limit:gasLimit,

                        input:
                        { 
                            address:account.address,
                            amount:fee,
                            sequence:sequence + 1,
                            signature:[1,signature],
                            public_key:[1,account.pubKey]
                        }

                    }
                ];

                return _this.broadcastTx(callTx).then(data => {                    
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