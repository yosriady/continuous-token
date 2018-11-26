# Continuous Curve-Bonded Token

ERC20 Continuous Token backed by bonding curves and an automated market maker contract.

## Directory Structure

```
├── app/                                        (Frontend React application)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
├── config/
├── contracts/                                  (Solidity smart contracts, or "the backend")
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
- [Program the Blockchain](https://programtheblockchain.com/): A series of Solidity tutorials.
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
npm run test
npm run start
```

Create an `.env` file in this project's root directory (see `env.sample` for an example):

```
MNEMONIC='foobar'
INFURA_ACCESS_TOKEN='test'
```

The `.env` file is used to deploy to Testnets such as `Ropsten` and `Rinkeby`. 
If you're developing locally, you can skip this step.

## Contributing

> We follow [GitHub Flow](https://guides.github.com/introduction/flow/).

To get started, create a new feature branch off of `master`:

```bash
git checkout -b feature/my-new-feature
```

Make your changes, then create a [pull request](https://github.com/yosriady/dapp-boilerplate/pulls), and ask for a review. After the review is approved, the author should merge the pull request to `master`. For this we always try to ["squash and merge"](https://blog.github.com/2016-04-01-squash-your-commits/).

## Thanks

**continuous-token** ❤️ 2018+, Yos Riady. Released under the [MIT] License.<br>
Authored and maintained by Yos Riady with help from contributors ([list][contributors]).

> [yos.io](http://yos.io) &nbsp;&middot;&nbsp;
> GitHub [@yosriady](https://github.com/yosriady)

[MIT]: http://mit-license.org/
[contributors]: http://github.com/yosriady/continuous-token/contributors
