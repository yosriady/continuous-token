require('dotenv').config();
const HDWalletProvider = require('truffle-hdwallet-provider');

const RINKEBY_ENDPOINT = `https://rinkeby.infura.io/v3/${process.env.INFURA_ACCESS_TOKEN}`;

module.exports = {
  networks: {
    development: { // Ganache
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // 5777
    },
    rinkeby: {
      provider: () => new HDWalletProvider(process.env.MNEMONIC, RINKEBY_ENDPOINT),
      network_id: 3,
      gas: 3000000,
      gasPrice: 21,
    },
  },
  compilers: {
    solc: {
      version: '0.4.25',
    },
  },
};
