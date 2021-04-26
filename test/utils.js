const chalk = require('chalk');
const { expect } = require("chai");
const { BigNumber } = require("ethers");
const { ethers } = require("hardhat");
const assert = require("assert");
const web3 = require("web3")

const log1 = console.log;
const logRed = (text) => console.log(chalk.red(text))
const logWB = (text) => console.log(chalk.white.bgBlue.bold(text))
/**
      console.log(chalk.red("Lost in cosmos!"));
      console.log(chalk.white.bgBlue.bold("The Big Bang Theory!"));
log1(chalk`
CPU: {red ${12}%}
RAM: {green ${46 / 100 * 100}%}
`);
*/
//-------------==
const options = {
  foo: "foo"
};
const BN = web3.utils.BN;
const bigNum = (item) => BigNumber.from(item);
const dp = 18;
const base = bigNum(10).pow(dp);

const SECONDS_IN_A_DAY = 86400;

const MAX_INTEGER = new BN(2).pow(new BN(256)).sub(new BN(1));
const OptionType = { Put: 1, Call: 2 };
const addr0 = "0x0000000000000000000000000000000000000000";

const fromWeiE = (weiAmount, dp = 18) => {
  try {
    return ethers.utils.formatUnits(weiAmount.toString(), parseInt(dp));
  } catch (err) {
    console.error("fromWeiE() failed:", err);
    return -1;
  }
}//input: BN or string, dp = 6 or 18 number, output: string

const toWeiE = (amount, dp = 18) => {
  try {
    return ethers.utils.parseUnits(amount.toString(), parseInt(dp));
  } catch (err) {
    console.error("toWeiE() failed:", err);
    return -1;
  }
}//input: string, output: Bn

const fromWei = (weiAmount) => fromWeiE(weiAmount);
//web3.utils.fromWei(weiAmount.toString(), "ether");

const toWei = (amount) => toWeiE(amount);
//web3.utils.toWei(amount.toString(), "ether");

//--------------------== 
const jsonrpc = "2.0";
const id = 0; //31337
const makeRPC = async (method, params = []) =>
  await network.provider.request({ id, jsonrpc, method, params });
//web3.currentProvider.makeRPC({ id, jsonrpc, method, params })

const timeForwardInSeconds = async (seconds) => {
  log1(chalk.bgRedBright("\nOn Time Forward", seconds, "seconds"));
  await timeForward(seconds);
};

const timeForward = async (seconds) => {
  await makeRPC("evm_increaseTime", [seconds]);
  await makeRPC("evm_mine");
};

const send = (method, params = []) =>
  new Promise((resolve, reject) =>
    web3.currentProvider.send(
      { id: 0, jsonrpc: "2.0", method, params },
      (err, x) => {
        if (err) reject(err);
        else resolve(x);
      }
    )
  );
const snapshot = () => send("evm_snapshot").then(x => x.result);

const revert = (snap) => send("evm_revert", [snap])

//--------------------== Numerical
/**
      var val = 37.435345;
      decimals = countDecimals(val);
      log1("decimals:", decimals)
 */
const countDecimals = (value) => {
  if (Math.floor(value) !== value)
    return value.toString().split(".")[1].length || 0;
  return 0;
};

const moveDecimalToLeft = (n, firstM) => {
  var l = n.toString().length - firstM;
  var v = n / Math.pow(10, l);
  log1("l:", l, ", v:", v);
  return v;
}

//--------------------== 
module.exports = {
  BigNumber, options,
  toWei, logRed, logWB,
  fromWei,expect, ethers,
  timeForward,
  countDecimals, timeForwardInSeconds,
  log1, bigNum, base, SECONDS_IN_A_DAY,
  MAX_INTEGER, OptionType, addr0
};
