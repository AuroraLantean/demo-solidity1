require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-web3");
require("@nomiclabs/hardhat-ganache");
require("@nomiclabs/hardhat-etherscan");
//   package.json: "type": "module",

// This is a sample Hardhat task. To learn how to create your own go to https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

//npx hardhat balance --account 0x1234
task("balance", "Prints an account's balance")
  .addParam("account", "The account's address")
  .setAction(async (taskArgs) => {
    const account = web3.utils.toChecksumAddress(taskArgs.account);
    const balance = await web3.eth.getBalance(account);

    console.log(web3.utils.fromWei(balance, "ether"), "ETH");
  });

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**process.env.MNEMONIC
 * process.env.ALCHEMY_MAINNET_RPC_URL
 * process.env.KOVAN_RPC_URL
 * @type import('hardhat/config').HardhatUserConfig
 */
const PRIVATEKEY1 = "";
const PRIVATEKEY2 = "";
const nodeUrlInfuraMain = "https://mainnet.infura.io/v3/";
const nodeUrlInfuraKovan = "https://kovan.infura.io/v3/";
// https://rinkeby.infura.io/v3/
const nodeUrlAlchemyMain = "https://eth-mainnet.alchemyapi.io/v2/";
const nodeUrlAlchemy4 = "https://eth-rinkeby.alchemyapi.io/v2/";
const nodeUrlAlchemy42 = "https://eth-kovan.alchemyapi.io/v2/";

const nodeUrlXDAI1 = "https://rpc.xdaichain.com/";

const isToFork = 0;
const networkNum = 1;
let hardhatObj = {
  chainId: 1337
};
let nodeService;
if (1 === isToFork) {
  console.log("forking enabled!");

  if (networkNum === 1) {
    console.log("user Mainnet 1");
    hardhatObj = {
      forking: {
        url:nodeUrlInfuraMain,
        blockNumber: 11613183,
      },
    };
  } else if (networkNum === 4) {
    console.log("user Rinkeby 4");
    hardhatObj = {
      forking: {
        url: nodeUrlAlchemy4,
        blockNumber: 7858526
      },
    };

  } else if (networkNum === 42) {
    console.log("user Koven 42");
    hardhatObj = {
      forking: {
        url: nodeUrlAlchemy42,
        blockNumber: 22930729
      },
    };
  } else if (networkNum === 100) {
    console.log("user XDAI 100");
    hardhatObj = {
      forking: {
        url: nodeUrlXDAI1,
        blockNumber: 13929665
      },
    };

  }
}
module.exports = {
  //defaultNetwork: "ganache",
  defaultNetwork: "hardhat",
  networks: {
    ganache: {
      gasLimit: 6000000000,
      defaultBalanceEther: 10,
      url: ""
    },
    hardhat: hardhatObj,
    // kovan: {
    //   url: nodeUrlInfuraKovan,
    //   accounts: [`0x${PRIVATEKEY1}`]
    //   // accounts: {
    //   //   mnemonic: "exact emotion north west calm village this treat pony uniform labor pen skill obscure empty"
    //   // }
    // },
    // rinkeby: {
    //   url: "https://rinkeby.infura.io/v3/",
    //   accounts: [PRIVATEKEY1, PRIVATEKEY2]
    // }
  },
  solidity: {
    version: "0.8.4",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
    deploy: 'deploy',
    deployments: 'deployments',
    imports: 'imports',
  },
  mocha: {
    timeout: 20000,
  },
};
