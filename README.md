![Snack](https://thumb.ibb.co/bWVvmS/snack.png "Snack")

-----------------------

This document has inspired by truffle README.md

Snak is an simple node.js app which already is under development, aiming to facilitate working with hyperledger Burrow without using Monax.

### with snak you will have these facilities:

* Easily install and uninstall hyperledger burrow.
* Built-in smart contract compilation, linking, deployment.
* Having interaction with blockchain(Burrow) directly via linux terminal.
* Automated contract testing with Mocha and Chai(will be added in future).
* Network management for deploying to many public & private networks.
* Interactive console for direct contract communication(will be added in future).

### Install

```
$ npm install -g snak
```

### Quick Usage
```
Install Burrow
(for now only Ubuntu 16.04 amd64 is supported)
will copy Burrow necessary files in the '$HOME/.burrow' and the Burrow executable file in the '/usr/bin'

$ snak install

```
```
Uninstall Burrow
First it makes a backup of '$HOME/.burrow' and puts that in the '$HOME/burrow-backup' folder, then will delete the '$HOME/.burrow' and 'usr/bin/burrow'

 $ snak uninstall
 
```
```
Delete backub files

 $ snak clean-backup
 
```
```
Run Burrow

 $ snak run-burrow
 
```

```
Send random transaction
$ snak rtx <count>

This command uses the pre-defined acounts to send the random amount transactions between these accounts! 
```
```
Send transaction

$ snak transact <priv_key> <data> <address> <fee> <gas_limit>

```

For a default set of contracts and tests, run the following within an empty project directory:

```
Initialize project:

$ snak init
```

From there, you can run `snak compile`, `snak migrate` and `snak test`(will be implemented in future) to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

```
Compile smart contracts:

$ snak compile

it will compile all the contracts which are already inside the contract folder and makes the Bytecodes and ABIs and put them in the build directory.
```
```
Deploy smart contracts:

$ snak migrate [accountname]

[accountname] is optional, if you do not want to use default account you can save your account in a standard account json file in the accounts folder and name it 'account.json'.

```
Be sure you launch the Burrow using `$snak run-burrow` or `$snak rnbur` and put all contracts on the contract folder before running these commands.

```
Call smart contract's functions:

$ snak call <contract_name> <function_name> <parameters_list>

The parameters are pretty clear the only thing you need to care is parameters_list, its formar must be like this:   var1,var2,...,varK (comma separated)

```

### Example :
* Calculator

```
pragma solidity 0.4.18;

contract Calculator {

    function Sum(int x1, int x2) public pure returns(int) {

        return (x1 + x2);
    }

    function Mul(int x1, int x2) public pure returns(int) {

        return (x1 * x2);
    }

    function Div(int x1, int x2) public pure returns(int) {

        return (x1 / x2);
    }

    function Sub(int x1, int x2) public pure returns(int) {

        return (x1 - x2);
    }

}


```
```
ahmad@blockchain:~/projects/calculator$ snak compile

[ '/home/ahmad/projects/calculator/contracts/Calculator.sol' ]
Compiling ./contracts/Calculator.sol...
Compile finished successfully!!!
Artifacts have been created successfully!!!

ahmad@blockchain:~/projects/calculator$ snak migrate

1)Calculator  :  

6060604052341561000f57600080fd5b6101d08061001e6000396000f300606060405260043610610062576000357c01000000000000000000000000000000000
00000000000000000000000900463ffffffff168063166dec531461006757806375aac69e146100a7578063eb638f12146100e7578063fa94904d14610127575b
600080fd5b341561007257600080fd5b6100916004808035906020019091908035906020019091905050610167565b60405180828152602001915050604051809
10390f35b34156100b257600080fd5b6100d16004808035906020019091908035906020019091905050610174565b604051808281526020019150506040518091
0390f35b34156100f257600080fd5b610111600480803590602001909190803590602001909190505061018a565b6040518082815260200191505060405180910
390f35b341561013257600080fd5b6101516004808035906020019091908035906020019091905050610197565b60405180828152602001915050604051809103
90f35b6000818303905092915050565b6000818381151561018157fe5b05905092915050565b6000818301905092915050565b60008183029050929150505600a
165627a7a723058207a1e93b6e5c4865a3bdbe8b35dc915a6e4d372e4f70c73338ff905d3f9e1f3c40029

Address : 28F6FCF5278157FF68476E9E165B6FDA406A4E10

Calculator has been successfully deployed! 

ahmad@blockchain:~/projects/calculator$ snak call Calculator Mul 12,10
"120"

```

### Video Tutorial
https://www.youtube.com/watch?v=tq-M3c-fMCo&feature=youtu.be

### Contributing
All contributions are welcome: use-cases, documentation, code, patches, bug reports, feature requests, etc. 
### License

MIT
