import Web3 from 'web3';

// Compiled contract artifacts
import MyToken from './contracts/MyToken.json';

const web3 = new Web3(Web3.givenProvider);
const NETWORK_ID = '5777'; // local Ganache network id
const options = {
  contracts: [
    MyToken,
  ],
  events: {
    MyToken: ['Minted'],
  },
  polls: {
    blocks: 3000,
  },
  syncAlways: true,
};

export default options;
