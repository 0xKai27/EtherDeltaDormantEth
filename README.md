# EtherDelta Dormant Funds

This project queries the EtherDelta contract (https://etherscan.io/address/0x8d12a197cb00d4747a1fe03395095ce2a5cc6819) for account ETH balances. The goal is to identify the owners of the dormant funds and enable them to withdraw from the contract.

To run this, you will need your own api keys for the Ethers.js provider as well as Etherscan.

```
npm install
npx hardhat run scripts/etherscan.ts
```
