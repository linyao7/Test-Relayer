"use strict";
const express = require('express');
const helmet = require('helmet');
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(helmet());
var cors = require('cors')
app.use(cors())
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://0.0.0.0:8545'));

//modify address according to deployed address
const CONTRACT_ADDRESS = '0xc351628EB244ec633d5f21fBD6621e1a683B1181'
let metaTransactions = []

let accounts
web3.eth.getAccounts().then((_accounts)=>{
  accounts=_accounts
  console.log("ACCOUNTS: ",accounts)
})

app.post('/addMetaTransaction', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  metaTransactions.push(req.body);
  console.log("metaTransactions", metaTransactions)

  let transactionObject = {
    from: accounts[0],
    to: CONTRACT_ADDRESS,
    data: req.body.transactionData
  }
  console.log('sending txn...')
  web3.eth.sendTransaction(transactionObject).then((receipt) => {
    console.log('receipt: ', receipt)
  })
  
  res.send('New meta transaction successfully added!')
});

app.listen(3001);
console.log(`http listening on 3001`);