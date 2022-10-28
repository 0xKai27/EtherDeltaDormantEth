
import { AlchemyProvider } from "@ethersproject/providers";
import { Contract } from "ethers";
import { ethers } from "hardhat";
import axios from "axios";
import * as CSV from '../utility/csv';
import { exportPath } from '../utility/exportPath';

type userBalance = {
  address: string,
  balance: string,
  ens?: string,
  block?: string
}

let provider: any;
let etherdeltaContract: Contract;
let currentBlock: number;
let userBalances: userBalance[] = [];

const etherdeltaCreationBlock: number = 3154196; // Start searching logs from this block (3154196)

async function main() {
    await getProvider();
    await getContract();
    await getCurrentBlock();
    await getDepositEvents();
    // await getWithdrawEvents();
    await resolveEns();
    await updateBalances();
    await exportToCsv();
}

async function getProvider() {
  console.log(`Configuring provider...`);

  const ALCHEMY_API_KEY: string = 'YOUR OWN API KEY HERE';
  provider = new ethers.providers.AlchemyProvider('homestead', ALCHEMY_API_KEY);
  
}

async function getContract() {
  console.log(`Getting the EtherDelta contract...`);

  const etherdeltaContractAddress: string = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819';
  const etherdeltaContractAbi: string = '[{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"}],"name":"trade","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"order","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orderFills","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"cancelOrder","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"}],"name":"withdraw","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"depositToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"amountFilled","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"address"}],"name":"tokens","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeMake_","type":"uint256"}],"name":"changeFeeMake","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeMake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeRebate_","type":"uint256"}],"name":"changeFeeRebate","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"sender","type":"address"}],"name":"testTrade","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeAccount_","type":"address"}],"name":"changeFeeAccount","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeRebate","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"feeTake_","type":"uint256"}],"name":"changeFeeTake","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"admin_","type":"address"}],"name":"changeAdmin","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"}],"name":"withdrawToken","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"bytes32"}],"name":"orders","outputs":[{"name":"","type":"bool"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"feeTake","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"accountLevelsAddr_","type":"address"}],"name":"changeAccountLevelsAddr","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"accountLevelsAddr","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"token","type":"address"},{"name":"user","type":"address"}],"name":"balanceOf","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"tokenGet","type":"address"},{"name":"amountGet","type":"uint256"},{"name":"tokenGive","type":"address"},{"name":"amountGive","type":"uint256"},{"name":"expires","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"user","type":"address"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"availableVolume","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"admin_","type":"address"},{"name":"feeAccount_","type":"address"},{"name":"accountLevelsAddr_","type":"address"},{"name":"feeMake_","type":"uint256"},{"name":"feeTake_","type":"uint256"},{"name":"feeRebate_","type":"uint256"}],"payable":false,"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"}],"name":"Order","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"expires","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"v","type":"uint8"},{"indexed":false,"name":"r","type":"bytes32"},{"indexed":false,"name":"s","type":"bytes32"}],"name":"Cancel","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"tokenGet","type":"address"},{"indexed":false,"name":"amountGet","type":"uint256"},{"indexed":false,"name":"tokenGive","type":"address"},{"indexed":false,"name":"amountGive","type":"uint256"},{"indexed":false,"name":"get","type":"address"},{"indexed":false,"name":"give","type":"address"}],"name":"Trade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"balance","type":"uint256"}],"name":"Withdraw","type":"event"}]';
  etherdeltaContract = new ethers.Contract(etherdeltaContractAddress, etherdeltaContractAbi, provider);
}

async function getCurrentBlock() {
    console.log(`Getting latest block number...`);
  
    currentBlock = await provider.getBlockNumber();
    console.log(`Latest block number: ${currentBlock}`);
}

async function getDepositEvents() {
    console.log(`Getting deposit events...`);

    const module: string = 'logs';
    const apikey: string = 'YOUR OWN ETHERSCAN API KEY HERE';
    const action: string = 'getLogs';
    const etherdeltaContractAddress: string = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819';
    const topic0: string = ethers.utils.id('Deposit(address,address,uint256,uint256)');

    for (let i = etherdeltaCreationBlock; i <= currentBlock; i += 100000) {
        let j = (i > currentBlock) ? currentBlock : i;

        await axios.get('https://api.etherscan.io/api', {
            params: {
                module,
                apikey,
                action,
                fromBlock: j,
                toBlock: j + 99999,
                address: etherdeltaContractAddress,
                topic0
            }
        }).then((response) => {
            const depositLogs = response.data.result;
            depositLogs.forEach((log: any) => {
                let parsedLog = etherdeltaContract.interface.parseLog(log);

                // Initiate an exist flag to determine whether the user already exists for this batch
                let existingUser: boolean = false;
                
                // Update the balance if the user exists
                userBalances.forEach((user) => {
                    if (user.address == parsedLog.args!.user) {
                        user.balance = parsedLog.args!.balance;
                        user.block = parseInt(log.blockNumber, 16).toString();
                        existingUser = true;
                        return;
                    };
                })

                // Add user to array if new
                if (!existingUser) {
                    userBalances.push({
                        address: parsedLog.args!.user,
                        balance: parsedLog.args!.balance,
                        block: parseInt(log.blockNumber, 16).toString()
                    });
                }
            })
        })
    }   
}

async function getWithdrawEvents() {
    console.log(`Getting withdraw events...`);

    const module: string = 'logs';
    const apikey: string = 'YOUR OWN ETHERSCAN API KEY HERE';
    const action: string = 'getLogs';
    const etherdeltaContractAddress: string = '0x8d12A197cB00D4747a1fe03395095ce2A5CC6819';
    const topic0: string = ethers.utils.id('Withdraw(address,address,uint256,uint256)');

    for (let i = etherdeltaCreationBlock; i <= currentBlock; i += 100000) {
        let j = (i > currentBlock) ? currentBlock : i;

        await axios.get('https://api.etherscan.io/api', {
            params: {
                module,
                apikey,
                action,
                fromBlock: j,
                toBlock: j + 99999,
                address: etherdeltaContractAddress,
                topic0
            }
        }).then((response) => {
            const depositLogs = response.data.result;
            depositLogs.forEach((log: any) => {
                let parsedLog = etherdeltaContract.interface.parseLog(log);

                // Initiate an exist flag to determine whether the user already exists for this batch
                let existingUser: boolean = false;
                
                // Update the balance if the user exists
                userBalances.forEach((user) => {
                    if (user.address == parsedLog.args!.user) {
                        user.balance = parsedLog.args!.balance;
                        user.block = parseInt(log.blockNumber, 16).toString();
                        existingUser = true;
                        return;
                    };
                })

                // Add user to array if new
                if (!existingUser) {
                    userBalances.push({
                    address: parsedLog.args!.user,
                    balance: parsedLog.args!.balance,
                    block: parseInt(log.blockNumber, 16).toString()
                    });
                }
            })
        })
    }   
}

async function resolveEns() {
  console.log(`Resolving the ENS names...`);

  for (let i = 0; i <= userBalances.length; i++) {
    if (userBalances[i] === undefined) {
      return;
    }

    if (typeof userBalances[i] !== null && ethers.utils.isAddress(userBalances[i].address)) {
        console.log(userBalances[i].address);
        try {
            const name = await provider.lookupAddress(userBalances[i].address);
            if (name !== null) {
              userBalances[i].ens = name;
            }
        } catch (err) {
            console.log(err);
        }

    }
  }
}

async function updateBalances() {
    console.log(`Querying latest balances...`);

    for (let i = 0; i < userBalances.length; i++) {
        let latestBalance = await etherdeltaContract.balanceOf('0x0000000000000000000000000000000000000000', userBalances[i].address)
        userBalances[i].balance = latestBalance;
        console.log(`address: ${userBalances[i].address}, ENS: ${userBalances[i].ens}, Balance: ${ethers.utils.formatEther(latestBalance)}`);
    }
}

async function exportToCsv() {
  console.log(`Exporting to CSV...`);

  // Convert the balances to ethers
  userBalances.forEach(user => {
    let balanceWei = ethers.BigNumber.from(user.balance);
    user.balance = ethers.utils.formatEther(balanceWei);
  });

  // json2csv
  let fields = [
    {
      label: "User Account",
      value: "address"
    },
    {
      label: "Account Balance",
      value: "balance"
    },
    {
      label: "ENS Name",
      value: "ens"
    }
  ]

  let csv = CSV.json2csv(userBalances, fields);
  CSV.exportCsv(csv, exportPath.userBalances);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
