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

  // Update to "In Transit" status (status code 2)
  console.log(`Updating shipment ${trackingId} to "In Transit" status...`)

  const tx = await shippingContract.updateShipmentStatus(
    trackingId,
    2, // InTransit status
    "Chicago Distribution Center",
    "Package in transit to destination",
  )

  console.log("Transaction hash:", tx.hash)
  await tx.wait()
  console.log("Shipment status updated successfully!")

  // Get the updated shipment details
  const shipment = await shippingContract.getShipment(trackingId)
  console.log("Updated shipment status:", shipment.status.toString())

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
