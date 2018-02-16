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
  .description('Compile all contracts in contracts folder \n and makes artifacts in the build folder\
  \nyou need to initialize a project before using this command')
  .action(() => {
    actions.compile();
  });

program
  .command('init ')
  .alias('i')
  .description('Initialize project')
  .action(() => actions.init());

  program
  .command('accounts ')
  .alias('a')
  .description('Load all accounts\
  \nyou need to initialize a project before using this command')
  .action(() => actions.loadAccounts(config));

  program
  .command('migrate [accountname] ')
  .alias('m')
  .description('deploy contract on the Burrow\
  \nyou need to initialize a project before using this command')
  .action((accountname) => actions.migrate(config,accountname));

  program
  .command('transact <priv_key> <data> <address> <fee> <gas_limit>')
  .alias('t')
  .description('Do regular transaction you need pass the private key of sender and address of reciever\
  \nyou need to initialize a project before using this command')
  .action((priv_key,data,address,fee,gas_limit) => actions.transact(config,priv_key,data,address,fee,gas_limit));

  program
  .command('random_transact <count>')
  .alias('r')
  .description("Doing random Transaction, \
   \nyou need to initialize a project before using this command\n\
  , \nand put a list of accounts in account_list folder first!.")
  .action((count) => actions.randomTransact(config,count));

  program
  .command('--install')
  .alias('install')
  .description('install burrow blockchain, \n and copy the files to the home directory (.burrow), \
  \nNo need to initialize project for this command')
  .action(() => actions.installBurrow());

  program
  .command('--uninstall')
  .alias('uninstall')
  .description('uninstall burrow blockchain, \n and back up the files to the home directory (burrow-backup), \
  \nNo need to initialize project for this command')
  .action(() => actions.uninstallBurrow());

  program
  .command('--burrow')
  .alias('burrow')
  .description('run burrow blockchain, \nyou need install burrow first!, \
  \nNo need to initialize project for this command')
  .action(() => actions.burrow());

  program
  .command('--clean')
  .alias('clean-backup')
  .description('This command will clean up the backup folder, \
  \nNo need to initialize project for this command')
  .action(() => actions.cleanBackup());
  
program.parse(process.argv);