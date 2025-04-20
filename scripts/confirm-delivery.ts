import { ethers } from "hardhat"

async function main() {
  // Get the contract address and tracking ID from the command line arguments
  const contractAddress = process.argv[2]
  const trackingId = process.argv[3]

  if (!contractAddress || !trackingId) {
    console.error("Please provide the contract address and tracking ID as command line arguments")
    process.exit(1)
  }

  // Get the contract instance
  const ShippingContract = await ethers.getContractFactory("ShippingContract")
  const shippingContract = ShippingContract.attach(contractAddress)

  // Get the shipment to check the receiver
  const shipment = await shippingContract.getShipment(trackingId)
  console.log("Shipment receiver:", shipment.receiver)

  // Get all accounts
  const accounts = await ethers.getSigners()

  // Find the account that matches the receiver
  const receiverAccount = accounts.find((account) => account.address.toLowerCase() === shipment.receiver.toLowerCase())

  if (!receiverAccount) {
    console.error("Receiver account not found in available accounts")
    process.exit(1)
  }

  // Connect as the receiver
  const receiverContract = shippingContract.connect(receiverAccount)

  console.log(`Confirming delivery for shipment ${trackingId}...`)

  const tx = await receiverContract.confirmDelivery(trackingId)

  console.log("Transaction hash:", tx.hash)
  await tx.wait()
  console.log("Delivery confirmed successfully!")

  // Get the updated shipment details
  const updatedShipment = await shippingContract.getShipment(trackingId)
  console.log("Updated shipment status:", updatedShipment.status.toString())

  // Get all status updates
  const updates = await shippingContract.getStatusUpdates(trackingId)
  console.log(
    "Status updates:",
    updates.map((update) => ({
      status: update.status.toString(),
      location: update.location,
      notes: update.notes,
      timestamp: new Date(update.timestamp.toNumber() * 1000).toISOString(),
    })),
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
