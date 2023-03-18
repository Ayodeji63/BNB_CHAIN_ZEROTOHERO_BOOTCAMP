const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers")

const { expect } = require("chai")

const { ethers } = require("hardhat")

describe("BadgerNFT", () => {
    async function runEveryTime() {
        const [owner, acc2, acc3, acc4] = await ethers.getSigners()
        const BadgerNFT = await ethers.getContractFactory("BadgerNFT")
        const badgerNFT = await BadgerNFT.deploy()

        return { owner, acc2, acc3, acc4, badgerNFT }
    }

    describe("Mint New NFT", () => {
        it("Should mint NFT", async () => {
            const { owner, badgerNFT, acc2, acc3 } = await loadFixture(
                runEveryTime
            )

            // const tokenID = await badgerNFT._tokenIdCounter.current()

            // Mint the first NFT token and check that the event was emitted
            await expect(badgerNFT.safeMint(acc2.address))
                .to.emit(badgerNFT, "Transfer")
                .withArgs(ethers.constants.AddressZero, acc2.address, 0)

            // Check that acc2 is the owner of the first token minted
            expect(await badgerNFT.ownerOf(0)).to.equal(acc2.address)

            // Mint the second token and check that the event was emitted
            await expect(badgerNFT.safeMint(acc3.address))
                .to.emit(badgerNFT, "Transfer")
                .withArgs(ethers.constants.AddressZero, acc3.address, 1)

            // Check that acc3 is the owner of the first token minted
            expect(await badgerNFT.ownerOf(1)).to.equal(acc3.address)
        })
    })

    describe("Transfer Nft", () => {
        it("Should Transfer NFT", async () => {
            const { badgerNFT, acc2, acc3 } = await loadFixture(runEveryTime)

            await badgerNFT.safeMint(acc2.address)

            await expect(badgerNFT.transfer(acc2.address, acc3.address, 0))
                .to.emit(badgerNFT, "Transfer")
                .withArgs(acc2.address, acc3.address, 0)

            expect(await badgerNFT.ownerOf(0)).to.equal(acc3.address)
        })
    })

    describe("Pause Contract", () => {
        it("Should pause contract", async () => {
            const { badgerNFT, owner, acc2, acc3 } = await loadFixture(
                runEveryTime
            )
            // Pause contract
            await expect(badgerNFT.pause())
                .to.emit(badgerNFT, "Paused")
                .withArgs(owner.address)

            await expect(badgerNFT.safeMint(acc2.address)).to.be.revertedWith(
                "Pausable: paused"
            )
        })
    })

    describe("Unpause Contract", () => {
        it("Should Unpause contract and mint NFT", async () => {
            const { badgerNFT, owner, acc2, acc3 } = await loadFixture(
                runEveryTime
            )
            // Pause contract
            await expect(badgerNFT.pause())
                .to.emit(badgerNFT, "Paused")
                .withArgs(owner.address)

            await expect(badgerNFT.safeMint(acc2.address)).to.be.revertedWith(
                "Pausable: paused"
            )

            // Unpause Contract
            await expect(badgerNFT.unpause())
                .to.emit(badgerNFT, "Unpaused")
                .withArgs(owner.address)

            // Mint NFT
            await expect(badgerNFT.safeMint(acc2.address))
                .to.emit(badgerNFT, "Transfer")
                .withArgs(ethers.constants.AddressZero, acc2.address, 0)
        })
    })
})
