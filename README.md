Install package modules

```shell
npm install
```

On separate terminals:

1. Start hardhat local node
```shell
npx hardhat node
```

2. Deploy smart contracts
```shell
npx hardhat run --network localhost scripts/deploy.js 
```

3. Start node.js relayer
```shell
node relayer.js 
```

4. Start React-App
```shell
npm start 
```



Things done in this project:
1. Set up hardhat project
2. Set up ERC20 smart contract and interface
3. React front-end to send data to node.js backend
4. Set up simple POST api for front-end to send data to
5. The front-end successfully signs the msg and sends the message to the relayer, which proceeds to send the transaction. (Not sure if I got the idea of relaying correct)

Notes:
1. Contract addresses should be in an .env file for production
2. Changed location of compiled contracts to '/src'
