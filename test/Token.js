const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

const etherVal = (n) => {
  return ethers.utils.formatEther(n);
};

describe("Token", () => {
  let token, accounts, deployer, receiver, exchange;

  const name = "Token";
  const symbol = "TOKEN";
  const decimals = 18;
  const totalSupply = "1000000000";

  beforeEach(async () => {
    // Fetch token from blockchain
    const Token = await ethers.getContractFactory("Token");
    token = await Token.deploy();
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    receiver = accounts[1];
    exchange = accounts[2];
  });

  describe("Deployment", () => {
    it("has correct name", async () => {
      expect(await token.name()).to.equal(name);
    });

    it("has correct symbol", async () => {
      expect(await token.symbol()).to.equal(symbol);
    });

    it("has correct decimals", async () => {
      expect(await token.decimals()).to.equal(decimals);
    });

    it("has correct total supply", async () => {
      expect(await token.totalSupply()).to.equal(tokens(totalSupply));
    });

    it("assigns total supply to deployer", async () => {
      expect(await token.balanceOf(deployer.address)).to.equal(
        tokens(totalSupply)
      );
    });
  });

  describe("Sending Tokens", () => {
    let amount, prevBalance, transaction, result;
    beforeEach(async () => {
      amount = tokens(100);
      prevBalance = await token.balanceOf(deployer.address);
      // Transfer tokens
      transaction = await token
        .connect(deployer)
        .transfer(receiver.address, amount);
      result = await transaction.wait();
    });
    describe("Success", async () => {
      it("transfers token balances", async () => {
        // Ensure tokens were transferred (balance change)
        expect(await token.balanceOf(deployer.address)).to.equal(
          prevBalance.sub(amount)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("emits a transfer event", async () => {
        // Check for event
        const event = result.events[0];
        expect(event.event).to.equal("Transfer");

        // Check for event arguments
        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", () => {
      it("rejects invalid recipient", async () => {
        const amount = tokens(100);
        await expect(
          token.connect(deployer).transfer(ethers.constants.AddressZero, amount)
        ).to.be.reverted;
      });

      it("rejects insufficient balances", async () => {
        // Transfer more tokens than deployer has - 100M
        const invalidAmount = tokens(10000000000);
        await expect(
          token.connect(deployer).transfer(receiver.address, invalidAmount)
        ).to.be.reverted;
      });
    });
  });

  describe("Approving Tokens", () => {
    let amount, transaction, result;

    beforeEach(async () => {
      amount = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });
    describe("Success", () => {
      it("allocates an allowance for delegated token spending", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(amount);
      });

      it("emits an approval event", async () => {
        // Check for event
        const event = result.events[0];
        expect(event.event).to.equal("Approval");

        // Check for event arguments
        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(amount);
      });
    });
    describe("Failure", () => {
      it("rejects invalid spenders", async () => {
        await expect(
          token.connect(deployer).approve(ethers.constants.AddressZero, amount)
        ).to.be.reverted;
      });
    });
  });

  describe("Adjusting Allowance", () => {
    let amount, transaction, result, prevAllowance, allowance;

    beforeEach(async () => {
      amount = tokens(100);
      prevAllowance = tokens(100);
      transaction = await token
        .connect(deployer)
        .approve(exchange.address, prevAllowance);
      result = await transaction.wait();
    });
    describe("Success", () => {
      it("allowance is increased by correct amount", async () => {
        await token.increaseAllowance(exchange.address, amount);
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(prevAllowance.add(amount));
      });

      it("allowance is decreased by correct amount", async () => {
        await token.decreaseAllowance(exchange.address, amount);
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.equal(prevAllowance.sub(amount));
      });
    });

    describe("Failure", () => {
      it("reverted due to negative allowance", async () => {
        await expect(token.decreaseAllowance(exchange.address, tokens(110))).to
          .be.reverted;
      });
    });
  });

  describe("Delegated Token Transfer", () => {
    let amount, transaction, prevBalance, result;

    beforeEach(async () => {
      amount = tokens(100);

      transaction = await token
        .connect(deployer)
        .approve(exchange.address, amount);
      result = await transaction.wait();
    });
    describe("Success", async () => {
      beforeEach(async () => {
        prevBalance = await token.balanceOf(deployer.address);
        transaction = await token
          .connect(exchange)
          .transferFrom(deployer.address, receiver.address, amount);
        result = await transaction.wait();
      });

      it("transfers token balances", async () => {
        expect(await token.balanceOf(deployer.address)).to.equal(
          prevBalance.sub(amount)
        );
        expect(await token.balanceOf(receiver.address)).to.equal(amount);
      });

      it("resets the allowance", async () => {
        expect(
          await token.allowance(deployer.address, exchange.address)
        ).to.be.equal(0);
      });

      it("emits an approval event", async () => {
        // Check for event
        const event = result.events[0];
        expect(event.event).to.equal("Approval");

        // Check for event arguments
        const args = event.args;
        expect(args.owner).to.equal(deployer.address);
        expect(args.spender).to.equal(exchange.address);
        expect(args.value).to.equal(0);
      });

      it("emits a transfer event", async () => {
        // Check for event
        const event = result.events[1];
        expect(event.event).to.equal("Transfer");

        // Check for event arguments
        const args = event.args;
        expect(args.from).to.equal(deployer.address);
        expect(args.to).to.equal(receiver.address);
        expect(args.value).to.equal(amount);
      });
    });

    describe("Failure", async () => {
      // it('rejects invalid spenders', async () => {
      //   await expect(token.connect(deployer).transferFrom(ethers.constants.AddressZero, amount)).to.be.reverted
      // })

      it("rejects insufficient balances", async () => {
        // Transfer more tokens than deployer has - 100M
        const invalidAmount = tokens(100000000);
        await expect(
          token
            .connect(exchange)
            .transferFrom(deployer.address, receiver.address, invalidAmount)
        ).to.be.reverted;
      });
    });
  });
});
