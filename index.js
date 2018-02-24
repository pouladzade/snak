#!/usr/bin/env node
'use strict'
const program = require('commander');
var Actions = require('./actions');
var actions = new Actions;
var fs = require('fs');

var config;

try{
  
  let config_path =  process.cwd() + "/config.json";
  if (fs.existsSync(config_path)) {
      let content = fs.readFileSync(config_path);
      config = JSON.parse(content);
  }


}
catch(ex){
  console.log(ex);
}

program
  .version('0.0.1')
  .description('Burrow deployment tools');

program
  .command('compile')
  .alias('c')
  .description('Compile all contracts in contracts folder and makes artifacts in the build folder\
  you need to initialize a project before using this command.\n\n')
  .action(() => {
    actions.compile();
  });

program
  .command('init ')
  .alias('i')
  .description('Initialize project, makes folders and files which are needed for starting a dapp project.\n\n')
  .action(() => actions.init());

program
  .command('accounts ')
  .alias('ac')
  .description('Load all accounts\
  you need to initialize a project before using this command.\n\n')
  .action(() => actions.loadAccounts(config));

program
  .command('migrate [accountname] ')
  .alias('m')
  .description('deploy contract on the Burrow\
  you need to initialize a project before using this command.\n\n')
  .action((accountname) => actions.migrate(config,accountname));

program
  .command('transact <priv_key> <data> <address> <fee> <gas_limit>')
  .alias('tx')
  .description('Do regular transaction you need pass the private key of sender and address of reciever\
  you need to initialize a project before using this command.\n\n')
  .action((priv_key,data,address,fee,gas_limit) => actions.transact(config,priv_key,data,address,fee,gas_limit));

program
  .command('random_transact <count>')
  .alias('rtx')
  .description("Doing random Transaction, \
  you need to initialize a project before using this command\
  ,and put a list of accounts(name = account_list.json) in accounts folder first!.\n\n")
  .action((count) => actions.randomTransact(config,count));

program
  .command('install')
  .alias('ibur')
  .description('install burrow blockchain, and copy the files to the home directory (.burrow), \
  No need to initialize project for this command.\n\n')
  .action(() => actions.installBurrow());

program
  .command('uninstall')
  .alias('unbur')
  .description('uninstall burrow blockchain, and back up the files to the home directory (burrow-backup), \
  No need to initialize project for this command.\n\n')
  .action(() => actions.uninstallBurrow());

program
  .command('run-burrow')
  .alias('rnbur')
  .description('run burrow blockchain,you need install burrow first!, \
  No need to initialize project for this command.\n\n')
  .action(() => actions.burrow());

program
  .command('clean-backup')
  .alias('clb')
  .description('This command will clean up the backup folder, \
  No need to initialize project for this command.\n\n')
  .action(() => actions.cleanBackup());

program
  .command('*')
  .action(function(others){
    console.log('[Error] There isn\'t any command for "%s" \n\
    please type snack -h for more helps.\n', others);  
  });

  program
  .command('create_account <pass_phrase>')
  .alias('ca')
  .description("Creates unsafe account included private key, public key and address and displays on the terminal, \
  No need to initialize a project before using this command.\n\n")
  .action((pass_phrase) => actions.createAccount(config,pass_phrase));

  program
  .command('call <contract_name> <function_name> <parameters_list>')
  .alias('clf')
  .description("Calls the function of specefic contract, you need to pass the list of parameters like this var1,var2,...,varK ,comma separated, \
  You need to initialize a project before using this command.\n\n")
  .action((contract_name,function_name,parameters_list) => actions.callFunction(config,contract_name,function_name,parameters_list));


program.parse(process.argv);