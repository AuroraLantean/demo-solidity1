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
} = require("./utils.js");//logRed, logWB,

const { waffle} = require("hardhat");
const provider = waffle.provider;

const {} = require("./funcContracts");
//const chalk = require('chalk');

let Token, SalesCtrt, ctrt, price1, mesg1, balance1, balance0, allowance, amount, overrides;

//--------------== SalesCtrt
describe("SalesCtrt", function () {
  beforeEach(async function () {
      console.log("\n----------------== beforeEach Overall");
      [owner, user1, user2, user3, user4, ...addrs] = await ethers.getSigners();

      const factoryToken = await ethers.getContractFactory("ERC20PresetFixedSupply");
      Token = await factoryToken.deploy();
      await Token.deployed();
      expect(Token.address).to.properAddress;
      log1("Token contract is deployed to:", Token.address);

      log1("\n------------== Get tokens");
      //expect(await Token.symbol()).to.equal("Token");
      balance0 = await Token.balanceOf(owner.address);
      expect(await Token.totalSupply()).to.equal(balance0);

      log1("\n--------== send Token to user1");
      amount = 5000; //1285;
      await Token.transfer(user1.address, toWei(amount));
      balance1 = await Token.balanceOf(user1.address);
      expect(balance1).to.equal(toWei(amount));
      log1("balance1:", fromWei(balance1));
      balance0 = await Token.balanceOf(owner.address);
      log1("balance0:", fromWei(balance0));

      //--------------------==
      const factorySalesCtrt = await ethers.getContractFactory("SalesCtrt");
      SalesCtrt = await factorySalesCtrt.deploy(Token.address);
      await SalesCtrt.deployed();
      expect(SalesCtrt.address).to.properAddress;
      log1("SalesCtrt contract is deployed to:", SalesCtrt.address);
      ctrt = SalesCtrt;


      log1("owner:", owner.address, "\nuser1:", user1.address, "\nuser2:", user2.address);
      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));
      balance1ETH = await provider.getBalance(user1.address);
      log1("balance1ETH:", fromWei(balance1ETH));
      balance2ETH = await provider.getBalance(user2.address);
      log1("balance2ETH:", fromWei(balance2ETH));

      tx = await user1.sendTransaction({
        to: user2.address,
        value: ethers.utils.parseEther("1.0")
      });
      log1("txHash:", tx.hash);
      balance0ETH = await provider.getBalance(owner.address);
      log1("balance0ETH:", fromWei(balance0ETH));
      balance1ETH = await provider.getBalance(user1.address);
      log1("balance1ETH:", fromWei(balance1ETH));
      balance2ETH = await provider.getBalance(user2.address);
      log1("balance2ETH:", fromWei(balance2ETH));

      allowance = 1000;
      await Token.connect(user1).approve(ctrt.address, toWei(allowance));
      allowance1m = await Token.allowance(user1.address, ctrt.address);
      log1("\nallowance1m:", fromWei(allowance1m));

    });

  it("SalesCtrt", async function () {
      log1("\n--------------== SalesCtrt");
      price1 = await ctrt.slotPrices(1);
      log1("price1:", price1.toString());

      log1("\n------== buyViaETH");
      slotNumber = 1;
      string1 = "slot1_take1";

      balance1ETH = await provider.getBalance(user1.address);
      ethBal_ctrt = await provider.getBalance(ctrt.address);
      log1("balance1ETH:", fromWei(balance1ETH), ", ethBal_ctrt:", fromWei(ethBal_ctrt));

      mesg1 = await ctrt.mapStrg(slotNumber);
      log1("mesg1:", mesg1);
      tokenPrice = await ctrt.slotPrices(slotNumber);

      overrides = {value: tokenPrice};
      tx = await ctrt.connect(user1).buyViaETH(slotNumber, string1, overrides);
      //log1("tx:", tx);

      mesg1 = await ctrt.mapStrg(slotNumber);
      log1("mesg1:", mesg1);

      balance1ETH = await provider.getBalance(user1.address);
      ethBal_ctrt = await provider.getBalance(ctrt.address);
      log1("balance1ETH:", fromWei(balance1ETH), ", ethBal_ctrt:", fromWei(ethBal_ctrt));

      //----------------==
      log1("\n------== withdraw ETH");
      amount = 0;

      ethBal_ctrt = await provider.getBalance(ctrt.address);
      ethBal_owner = await provider.getBalance(owner.address);
      log1("ethBal_ctrt:", fromWei(ethBal_ctrt), ", ethBal_owner:", fromWei(ethBal_owner));

      tx = await ctrt.connect(owner).withdrawETH(owner.address, amount);
      ethBal_ctrt = await provider.getBalance(ctrt.address);
      ethBal_owner = await provider.getBalance(owner.address);
      log1("ethBal_ctrt:", fromWei(ethBal_ctrt), ", ethBal_owner:", fromWei(ethBal_owner));

      //----------------==
      log1("\n------== buyViaToken");
      slotNumber = 1;
      string1 = "slot1_take2";

      mesg1 = await ctrt.mapStrg(slotNumber);
      log1("mesg1:", mesg1);
      tokenPrice = await ctrt.slotPrices(slotNumber);
      
      tokenBal_user1 = await Token.balanceOf(user1.address);
      tokenBal_ctrt = await Token.balanceOf(ctrt.address);
      log1("tokenBal_user1:", fromWei(tokenBal_user1), ", tokenBal_ctrt:", fromWei(tokenBal_ctrt));

      tx = await ctrt.connect(user1).buyViaToken(slotNumber, string1, tokenPrice);
      //log1("tx:", tx);
      mesg1 = await ctrt.mapStrg(slotNumber);
      log1("mesg1:", mesg1);

      tokenBal_user1 = await Token.balanceOf(user1.address);
      tokenBal_ctrt = await Token.balanceOf(ctrt.address);
      log1("tokenBal_user1:", fromWei(tokenBal_user1), ", tokenBal_ctrt:", fromWei(tokenBal_ctrt));

      //----------------==
      log1("\n------== withdraw Token");
      amount = 0;

      tokenBal_ctrt = await Token.balanceOf(ctrt.address);
      tokenBal_owner = await Token.balanceOf(owner.address);
      log1("tokenBal_ctrt:", fromWei(tokenBal_ctrt), "tokenBal_owner:", fromWei(tokenBal_owner));

      tx = await ctrt.connect(owner).withdrawToken(owner.address, amount);
      tokenBal_ctrt = await Token.balanceOf(ctrt.address);
      tokenBal_owner = await Token.balanceOf(owner.address);
      log1("tokenBal_ctrt:", fromWei(tokenBal_ctrt), "tokenBal_owner:", fromWei(tokenBal_owner));

    });

});