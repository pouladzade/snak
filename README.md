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
* Uninstall Burrow
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
$ snak init
```

From there, you can run `snak compile`, `snak migrate` and `snak test`(will be implemented in future) to compile your contracts, deploy those contracts to the network, and run their associated unit tests.

```
$ snak compile

$ snak migrate [accountname]

[accountname] is optional, if you do not want to use default account you can save your account in a standard account json file in the accounts folder and name it 'account.json'.

Be sure you launch the Burrow using `$snak run-burrow` or `$snak rnbur` and put all contracts on the contract folder before running these commands.
```
### Video Tutorial
https://www.youtube.com/watch?v=tq-M3c-fMCo&feature=youtu.be

### Contributing
All contributions are welcome: use-cases, documentation, code, patches, bug reports, feature requests, etc. 
### License

MIT
