# DApp Boilerplate

Full-stack DApp boilerplate project.

## Directory Structure

```
├── app/                                        (Frontend React application)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
├── config/
├── contracts/                                  (Solidity smart contracts, or "the backend")
│   └── upgrades/                               (Upgradability proxies)
├── migrations/                                 (Smart contract deployment scripts)
├── test/                                       (Smart contract unit tests)
└── README.md
```

## Prerequisites

To get started, install the following on your machine:

- [Truffle CLI](https://truffleframework.com/truffle)
- [Ganache](https://truffleframework.com/ganache)
- [Metamask](https://metamask.io/)

## Solidity Learning Materials

> New to Solidity? Here are some recommended resources to start with.

- [Truffle Pet Shop tutorial](https://truffleframework.com/tutorials/pet-shop): An end-to-end walkthrough of the basics of building a dApp.
- [Program the Blockchaun](https://programtheblockchain.com/): A series of Solidity tutorials.
- [Solidity in Depth](http://solidity.readthedocs.io/en/v0.4.24/solidity-in-depth.html): It's important to familiarize yourself with the Solidity language.
- [ERC20 Token Standard Interface](https://theethereum.wiki/w/index.php/ERC20_Token_Standard#The_ERC20_Token_Standard_Interface): Other than the Solidity, you'll want to get familiar with the ERCX standards and EIP proposals within the ecosystem. The ERC20 standard is a widely adopted interface for tokens.
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-solidity): Once you have a firm grasp of the language and standards, start going through open source Solidity projects. The OpenZeppelin project is a  useful (albeit incomplete) overview of what's possible with smart contracts.
- [Smart Contract Best Practices](https://consensys.github.io/smart-contract-best-practices/): Helps you understand non-functional requirements within the smart contract ecosystem: design patterns, security, upgradability, and tooling.
- [Ethernaut](https://ethernaut.zeppelin.solutions/): Advanced security topics. Optional, but important.

## Setup

### Run Ganache

First, make sure that **Ganache is up and running locally** at port 7545:

- Go to Settings > Accounts & Keys 
- Disable `Autogenerate HD Mnemonic` and enter a Mnemonic you wish to use.

### Project Setup

```bash
git clone https://github.com/yosriady/dapp-boilerplate
cd dapp-boilerplate
npm install # Installs dependencies
npm run setup:hooks # Sets up pre-commit hook to automatically run linters and unit tests
```

Create an `.env` file in this project's root directory (see `env.sample` for an example):

```
MNEMONIC='foobar'
INFURA_ACCESS_TOKEN='test'
```

The `.env` file is used to deploy to Testnets such as `Ropsten` and `Rinkeby`. 
If you're developing locally, you can skip this step.

## Commands

This section documents a list of helpful commands for development.

### Run tests

> This command automatically deploys your contracts locally before running any tests.

```bash
npm test
npm run coverage
```

### Run linters

```bash
npm run lint
```

### Deploy contracts locally

You need to deploy your contracts locally in testRPC (Ganache) before you can interact with it from the console.

```bash
npm run migrate
```

### Hard reset contracts locally

```bash
npm run reset
```

### Interacting with contracts with Truffle console

```bash
npm run console
truffle(development)> MyToken.at('0x11437dd2e4b8fd663c7f1a784160d6ef2259161b')
...<Contract details>
truffle(development)> MyToken.at("0x11437dd2e4b8fd663c7f1a784160d6ef2259161b").totalSupply().then((n) => n.toString(10));
...<total supply>
```

### Running the frontend app

> Make sure you've run `npm run migrate` to deploy your contracts beforehand.

```bash
npm run start
```

Then, open `localhost:3000`.

You'll need to do the following to set up an account on Metamask:

- Click on the Metamask Chrome extension from your browser.
- Change your Network to Custom RPC and enter the local testRPC address `http://127.0.0.1:7545`.
- Select `Import Account with seed phrase` and pass in your mnemonic.
- Your account should now be set up and can now interact with the local dApp.

### Static analysis with Surya

You can set up [surya](https://github.com/ConsenSys/surya), a static analysis tool:

```bash
npm run setup:surya
```

> Go [here](https://github.com/ConsenSys/surya) for detailed usage instructions.

#### List Contract API

```bash
surya describe contracts/**/*.sol
```

#### Draw Contract Inheritance Tree

```bash
surya inheritance contracts/iPAYToken.sol | dot -Tpng > Graph.png | open Graph.png
```

#### Draw Control Flow Graph

```bash
surya graph contracts/**/*.sol | dot -Tpng > Graph.png | open Graph.png
```

### Static Analysis with Mythril

To set up [mythril](https://github.com/ConsenSys/mythril/wiki/With-Docker):

```
npm run setup:mythril
```

Then, from the root project directory run:

```
npm run mythril
```

## Deploying to a Testnet

- Make sure you have [MetaMask](https://metamask.io/) installed.
- On Metamask, select Rinkeby and Import an account using your configured `env` `MNEMONIC`.
- Copy the account number imported on Metamask to your clipboard,
- Make sure you have enough ether in your account to do the deployment and other transactions. You can acquire ether for your account on the Rinkeby network through a service known as a faucet [here](https://www.rinkeby.io/#faucet).
- Then, run:

```bash
npm run deploy
```

- If all goes well, you should see a successful deployment response. To verify that the contract is deployed, you check the [Rinkeby Etherscan](https://rinkeby.etherscan.io/).
- Find the transaction ID of the contract from the deployment response, and enter it in the search field. You should see details about the transaction, including the block number where the transaction was secured.
- After a deploy, we'll have the contract ABIs in the `build` folder. The frontend app will run with these ABIs as inputs. 

> If needed, save these artifacts in `build/ropsten` or `build/rinkeby` to have the app load a pinned environment.

## Contributing

> We follow [GitHub Flow](https://guides.github.com/introduction/flow/).

To get started, create a new feature branch off of `master`:

```bash
git checkout -b feature/my-new-feature
```

Make your changes, then create a [pull request](https://github.com/yosriady/dapp-boilerplate/pulls), and ask for a review. After the review is approved, the author should merge the pull request to `master`. For this we always try to ["squash and merge"](https://blog.github.com/2016-04-01-squash-your-commits/).

## Thanks

**dapp-boilerplate** ❤️ 2018+, Yos Riady. Released under the [MIT] License.<br>
Authored and maintained by Yos Riady with help from contributors ([list][contributors]).

> [yos.io](http://yos.io) &nbsp;&middot;&nbsp;
> GitHub [@yosriady](https://github.com/yosriady)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/yosriady/dapp-boilerplate/contributors
