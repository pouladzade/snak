'use strict'

var Transaction = require('./transaction');
var Accounts    = require('../accounts');
var Blockchain  = require('../blockchain');

module.exports = class BondTx extends Transaction {

    constructor(connectionURL) {   
        super(connectionURL);
    }

    /* format of the account object
    account =
    {
        "address": "",
        "pubKey": "",
        "privKey": ""
    }

    type BondTx struct {
        From   TxInput       `json:"from_account"`
        To     TxOutput      `json:"to_validator"`
        BondTo acm.PublicKey `json:"bond_to"`
        txHashMemoizer
    }

    func (tx *BondTx) WriteSignBytes(chainID string, w io.Writer, n *int, err *error) {
        signJson := fmt.Sprintf(`{"chain_id":%s,"tx":[%v,{"bond_to":"%v","from":"%v","to":%s}]}`,
            jsonEscape(chainID), TxTypeBond, tx.BondTo, tx.From.SignString(), tx.To.SignString())

        wire.WriteTo([]byte(signJson), w, n, err)
    }
    */

   broadcast(privKey,address,amount){
    let account = this.generateAccount(privKey);
    let accounts = new Accounts(this.connectionUrl);
    let _this = this;

    return accounts.getSequence(account.address).then(sequence => {            
        let blockchain = new Blockchain(_this.connectionUrl);
        return blockchain.getChainId().then(chainId => {
            let callSign = {
                chain_id:chainId,
                tx: [
                1,
                {
                    inputs:
                    [
                        { 
                            address:account.address,//source address
                            amount:amount,
                            sequence:sequence,// sequence of the source account
                        }
                    ],
    
                    address:address, 
                    gasLimit:gasLimit,
                    fee:fee,    
                    data:data
                }
              ]
            };
            
            let signature = _this.sign(account.privKey,JSON.stringify(callSign));
                    
            let callTx = [
                1,
                {
                    inputs:
                    [
                        { 
                            address:account.address,
                            amount:amount,
                            sequence:sequence,
                            signature:[1,signature],
                            public_key:[1,account.pubKey]
                        }
                    ],
    
                    address:address, 
                    gasLimit:gasLimit,
                    fee:fee,    
                    data:data
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