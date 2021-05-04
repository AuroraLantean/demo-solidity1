const {
  expect,
  ethers,
  BigNumber,
  assert,
  toWei,
  fromWei,
  timeForward,
  countDecimals,
  timeForwardInSeconds,
  log1,
  bigNum,
  base,
  SECONDS_IN_A_DAY,
} = require("./utils.js"); //logRed, logWB,

const { waffle } = require("hardhat");

const provider = waffle.provider;

const {} = require("./funcContracts");
//const chalk = require('chalk');

let Token, Box, box1, box2;

//--------------== Box
/**
$ yarn add --save-dev @openzeppelin/hardhat-upgrades
$ yarn add --save-dev @nomiclabs/hardhat-ethers ethers

need to configure Hardhat to use the @nomiclabs/hardhat-ethers and our @openzeppelin/hardhat-upgrades
*/
describe("Box", function () {
  beforeEach(async function () {
    console.log("\n----------------== beforeEach Overall");
    [owner, user1, user2, user3, user4, ...addrs] = await ethers.getSigners();

  });

  it('proxy test', async function () {
    Box = await ethers.getContractFactory("Box");
    box1 = await Box.deploy();

    log1("-------------------==")
    //require('@openzeppelin/hardhat-upgrades'); in hardhat.config.js
    box1 = await upgrades.deployProxy(Box, [41], {initializer: 'store'});
    log1("BoxProxyV1 deployed to:", box1.address);

    log1("test1")
    expect((await box1.retrieve()).toString()).to.equal('41');


    log1("-------------------==")
    BoxV2 = await ethers.getContractFactory("BoxV2");

    boxV2 = await upgrades.upgradeProxy(box1.address, BoxV2);
    log1("BoxProxyV2 deployed to:", boxV2.address);

    value = await boxV2.retrieve();
    expect(value.toString()).to.equal('41');

    // Increment
    await boxV2.increment();
  
    // Test if the returned value is the same one
    // Note that we need to use strings to compare the 256 bit integers
    log1("test new function")
    expect((await boxV2.retrieve()).toString()).to.equal('42');
  });
});
