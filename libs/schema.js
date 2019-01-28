'use strict'

var Schema = {

  project_path: process.cwd(),

  snack_path: __dirname,

  test: '/test',

  contracts: '/contracts',

  migration: '/migration',

  migration_output: '/migration_output_',

  build: '/build',

  accounts: '/accounts',

  account_list: '/account_list.json',

  default_account: '/account.json',

  transactions: '/transactions',

  random_transactions: '/random_transactions.json',

  template: '/templates',

  config_file: '/config.json',

  link_order_file: '/link_order.json'
}

module.exports = { Schema }
