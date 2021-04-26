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

let erc20, lpToken, rwToken, ctrt;

const b4each = async () => {
  //ReferenceError: lpToken is not defined
  [owner, user1, user2, user3, user4, ...addrs] = await ethers.getSigners();
  const factoryInstLpToken = await ethers.getContractFactory("AriesCoin");
  lpToken = await factoryInstLpToken.deploy("LpToken", "LpToken");
  await lpToken.deployed();
  expect(lpToken.address).to.properAddress;
  log1("LpToken contract is deployed to:", lpToken.address);
  erc20 = lpToken;

  log1("\n------------== Get tokens");
  expect(await lpToken.symbol()).to.equal("LpToken");
  let ownerBal = await lpToken.balanceOf(owner.address);
  expect(await lpToken.totalSupply()).to.equal(ownerBal);

  log1("\n--------== send lpTokens to user1");
  amount = 1285;
  await lpToken.transfer(user1.address, toWei(amount));
  balanceX = await lpToken.balanceOf(user1.address);
  expect(balanceX).to.equal(toWei(amount));
  log1("balanceX:", fromWei(balanceX));
  //10000000000000000000
  ownerBal = await lpToken.balanceOf(owner.address);
  log1("ownerBal:", fromWei(ownerBal));
  //expect(ownerBal).to.equal(amount);

  log1("\n--------== send lpTokens to user2");
  amount = 5000;
  await lpToken.transfer(user2.address, toWei(amount));
  balanceX = await lpToken.balanceOf(user2.address);
  expect(balanceX).to.equal(toWei(amount));
  log1("balanceX:", fromWei(balanceX));
  ownerBal = await lpToken.balanceOf(owner.address);
  log1("ownerBal:", fromWei(ownerBal));
};

describe("Transactions erc20", function () {
  it("Should fail if sender doesn’t have enough tokens", async function () {
    await b4each();

    const initialOwnerBalance = await erc20.balanceOf(owner.address);
    // Try to send 1 token from user1 (0 tokens) to owner (1000 tokens). `require` will evaluate false and revert the transaction.
    await expect(
      erc20.connect(user1).transfer(owner.address, 1)
    ).to.be.revertedWith("Not enough tokens");

    // Owner balance shouldn't have changed.
    expect(await erc20.balanceOf(owner.address)).to.equal(
      initialOwnerBalance
    );
  });

  it("transfer tokens", async function () {
    log1("\n----------------== Should transfer tokens between accounts");
    //expect(await erc20.owner()).to.equal(owner.address);
    const initialOwnerBalance = await erc20.balanceOf(owner.address);
    log1("initialOwnerBalance:", fromWei(initialOwnerBalance));

    // Transfer 50 tokens from owner to user1
    await erc20.transfer(user1.address, 100);
    let user1Balance = await erc20.balanceOf(user1.address);
    expect(user1Balance).to.equal(100);

    // Transfer 50 tokens from user1 to user2
    await erc20.connect(user1).transfer(user2.address, 50);
    let user2Balance = await erc20.balanceOf(user2.address);
    expect(user2Balance).to.equal(50);

    log1("\n----------------== Should update balances after transfers");

    // Transfer 100 tokens from owner to user1.
    await erc20.transfer(user1.address, 100);

    // Check balances.
    finalOwnerBalance = await erc20.balanceOf(owner.address);
    expect(finalOwnerBalance).to.equal(bn1.sub(200));

    user1Balance = await erc20.balanceOf(user1.address);
    log1("user1Balance:", fromWei(user1Balance));
    expect(user1Balance).to.equal(150);

    user2Balance = await erc20.balanceOf(user2.address);
    log1("user2Balance:", fromWei(user2Balance));
    expect(user2Balance).to.equal(50);
  });
});
