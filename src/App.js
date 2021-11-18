import './App.css';
import React, { Component } from 'react';
import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';

import TxnHandler from './artifacts/contracts/TxnHandler.sol/TxnHandler.json'
import { CONTRACT_ADDRESS } from './constants.js';

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {
      storageValue: 0,
      web3: null,
      accounts: null,
      contract: null,
      networkId: null,
      loading: true
    }

  }

  async componentDidMount() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3() {
    const provider = await detectEthereumProvider();
    window.web3 = new Web3(provider);
    if (provider) {
      await provider.request({ method: 'eth_requestAccounts' })
        .catch((err) => {
          if (err.code === 4001) {
            // EIP-1193 userRejectedRequest error
            // If this happens, the user rejected the connection request.
            console.log('Please connect to MetaMask.');
          } else {
            console.error(err);
          }
        });;
    }
    else if (window.web3) {
      console.log('entered2')
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. Try installing Metamask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3;

    //get user's accounts
    const accounts = await web3.eth.getAccounts();
    console.log(accounts);

    //get contract instance
    const networkId = await window.web3.eth.net.getId();
    console.log('networkId: ', networkId)
    console.log('contract address: ', CONTRACT_ADDRESS)
    const TxnHandlerInstance = new web3.eth.Contract(TxnHandler.abi, CONTRACT_ADDRESS);
    console.log(TxnHandlerInstance)

    this.setState({
      web3,
      accounts,
      contract: TxnHandlerInstance,
      networkId
    })
  }

  async signData() {
    const { web3, accounts, contract } = this.state;
    let signer = accounts[0];

    // to include this in the meta transaction
    let transactionData = contract.methods.giveTokens().encodeABI();
    console.log('txdata: ', transactionData);
    
    //EIP712 message construction
    const domain = [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ]
    const giveTokens = [
      { name: "sender", type: "address" },
      { name: "amount", type: "uint" },
    ]
    const domainSeparator = {
      name: "Test Domain",
      version: "1",
      chainId: '31337',
      verifyingContract: this.CONTRACT_ADDRESS,
    }
    const message = {
      sender: signer,
      description: 'Give 5 tokens to the relayer',
    }
    
    const msgParams = JSON.stringify({
      types: {
        EIP712Domain: domain,
        GiveTokens: giveTokens
      },
      domain: domainSeparator,
      primaryType: "GiveTokens",
      message: message,
      transactionData
    })

    //sends the message to metamask for user to sign on
    web3.currentProvider.send({
      method: "eth_signTypedData_v3",
      params: [signer, msgParams],
      from: signer,
    }, async function (err, result) {
      if (err) return console.dir(err)
      if (result.error) {
        alert(result.error.message)
      }
      if (result.error) return console.error('ERROR', result)

      //getting r s v from a signature for smart contract to verify
      //not sure how to proceed from here to batch them up
      const signature = result.result.substring(2);
      const r = "0x" + signature.substring(0, 64);
      const s = "0x" + signature.substring(64, 128);
      const v = parseInt(signature.substring(128, 130), 16);

      let metaTransaction = {
        r,
        s,
        v,
        signer
      }

      //did not finish up on meta transaction. adding msgParams to test calling the smart contract with transaction data
      fetch('http://localhost:3001/addMetaTransaction', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: msgParams
      })      
    })
  }

  render() {
    return (
      <div className="App">
        <h1>Testing a Relayer Architecture</h1>
        <button onClick={() => this.signData()}>Give Operator Tokens!</button>
      </div>
    );
  }
}

export default App;
