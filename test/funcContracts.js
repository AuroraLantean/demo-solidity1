const chalk = require("chalk");
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
} = require("./utils.js");

const getTokenBalance = async (token, target, prefix) => {
  tokenBalance = await token.balanceOf(target);
  log1("\n" + prefix + ":", fromWei(tokenBalance));
}

const transferToken = async (ctrt, user, username, amount = 0) => {
  log1("\n====== transferToken:", username);
  const dp = BigNumber.from("1000000000")
  let data = await ctrt.connect(user).transferToken(user.address);
  log1("poolBalance:", fromWei(data[0]));
  log1("totalShares:", fromWei(data[1]));
  log1("ctrt token balance:", fromWei(data[2]));
  //log1("sharePrice:", Number(data[2].div(dp)));
  const pStaking = fromWei(data[3][1]);
  const effPoolerBalance = fromWei(data[5]);
  log1("pooler shares:", fromWei(data[3][0]), ", pooler staking:", pStaking);

  // log1("winloseBalance:", fromWei(data[6]));
};


/**
 */

//--------------------==
module.exports = {
};
