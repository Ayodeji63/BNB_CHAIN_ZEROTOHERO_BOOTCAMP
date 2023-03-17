const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

const { expect } = require("chai")

const { ethers } = require("hardhat")

describe("BadgerNFT", () => {
    async function runEveryTime() {
        const [owner, acc2] = await ethers.getSigners()
        const BadgerNFT = await ethers.getContractFactory("BadgerNFT")
        const badgerNFT = await BadgerNFT.deploy()

        return { owner, acc2, badgerNFT }
    }

    describe("Deployment", () => {
        it("Should mint NFT", async () => {
            const { owner, badgerNFT } = await loadFixture(runEveryTime)

            const tokenIdBefore = await badgerNFT._tokenIdCounter.current()

            await badgerNFT.safeMint(owner.address)

            const tokenIdAfter = await badgerNFT._tokenIdCounter.current()

            expect(tokenIdAfter).to.be.equal(tokenIdBefore + 1)
        })
    })
})
