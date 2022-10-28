import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const ALCHEMY_API_KEY: string = 'eDLZsmpTXq4-Vrk-8eKgFxvtzWtQnXnX';

const config: HardhatUserConfig = {
  networks: {
    homestead: {
      url: `https://eth-mainnet.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
    }
  },
  solidity: "0.8.17",
};

export default config;
