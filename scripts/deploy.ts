import { ethers } from "hardhat"

async function main() {
  console.log("Deploying dPackChain Shipping Contract to Pharos Devnet...")

  // Deploy the contract
  const ShippingContract = await ethers.getContractFactory("ShippingContract")
  const shippingContract = await ShippingContract.deploy()

  await shippingContract.deployed()

  console.log(`ShippingContract deployed to: ${shippingContract.address}`)
  console.log("Transaction hash:", shippingContract.deployTransaction.hash)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
