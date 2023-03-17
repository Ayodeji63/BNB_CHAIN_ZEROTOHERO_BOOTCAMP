const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

const { expect } = require("chai")

const { ethers } = require("hardhat")

describe("Badger", () => {
    async function runEveryTime() {
        const TOTAL_SUPPLY = 1_000_000
        const DECIMALS = 18

        const [owner, acc2, acc3] = await ethers.getSigners()

        const BadgerCoin = await ethers.getContractFactory("BadgerCoin")
        const badgerCoin = await BadgerCoin.deploy(TOTAL_SUPPLY, DECIMALS)

        return { badgerCoin, TOTAL_SUPPLY, DECIMALS, owner, acc2, acc3 }
    }

    describe("Deployment", () => {
        it("should check the total supply is 1_000_000", async () => {
            const { TOTAL_SUPPLY, badgerCoin } = await loadFixture(runEveryTime)
            expect(await badgerCoin.TOTAL_SUPPLY()).to.equal(TOTAL_SUPPLY)
        })

        it("should check the Decimal is 18", async () => {
            const { badgerCoin, DECIMALS } = await loadFixture(runEveryTime)

            expect(await badgerCoin.DECIMALS()).to.equal(DECIMALS)
        })
    })

    describe("Transfer", () => {
        it("balanceOf should be 1_000_00", async () => {
            const { owner, badgerCoin, TOTAL_SUPPLY } = await loadFixture(
                runEveryTime
            )

            expect(await badgerCoin.balanceOf(owner.address)).to.be.equal(
                TOTAL_SUPPLY
            )
        })

        it("it should transfer to other accounts", async () => {
            const { badgerCoin, owner, acc2, acc3 } = await loadFixture(
                runEveryTime
            )
            const amount = 300
            await badgerCoin.transfer(acc2.address, amount)
            expect(await badgerCoin.balanceOf(acc2.address)).to.be.equal(amount)
        })

        it("Should revert if transfer is created with an insufficient balance ", async () => {
            const { badgerCoin, owner, acc2, acc3 } = await loadFixture(
                runEveryTime
            )

            const balance = await badgerCoin.balanceOf(owner.address)
            const amount = balance.add(200)

            console.log(`balance: ${balance}`)
            console.log(`amount: ${amount}`)

            expect(amount).to.be.gt(balance)
            await expect(
                badgerCoin.connect(owner).transfer(acc3.address, amount)
            ).to.be.revertedWith("ERC20: transfer amount exceeds balance")

            throw new Error("Expected transfer to revert")
        })
    })
})
