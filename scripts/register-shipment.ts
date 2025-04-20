import { ethers } from "hardhat"

async function main() {
  // Get the contract address from the command line arguments
  const contractAddress = process.argv[2]
  if (!contractAddress) {
    console.error("Please provide the contract address as a command line argument")
    process.exit(1)
  }

  // Get the contract instance
  const ShippingContract = await ethers.getContractFactory("ShippingContract")
  const shippingContract = ShippingContract.attach(contractAddress)

  // Generate a tracking ID
  const trackingId = await shippingContract.generateTrackingId()
  console.log(`Generated tracking ID: ${trackingId}`)

  // Example receiver address (replace with a real address)
  const receiverAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8"

  // Current timestamp + 7 days for estimated delivery
  const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

  console.log("Registering shipment...")

  // Register the shipment
  const tx = await shippingContract.registerShipment(
    trackingId,
    receiverAddress,
    "", // No receiver wallet for this example
    "Electronics Package",
    "123 Sender St, New York, NY",
    "456 Receiver Ave, Los Angeles, CA",
    2500, // 2.5kg in grams
    "30x20x15", // dimensions in cm
    estimatedDelivery,
  )

  console.log("Transaction hash:", tx.hash)
  await tx.wait()
  console.log("Shipment registered successfully!")

  // Get the shipment details
  const shipment = await shippingContract.getShipment(trackingId)
  console.log("Shipment details:", {
    trackingId: shipment.trackingId,
    sender: shipment.sender,
    receiver: shipment.receiver,
    description: shipment.description,
    status: shipment.status,
    timestamp: new Date(shipment.timestamp.toNumber() * 1000).toISOString(),
    estimatedDelivery: new Date(shipment.estimatedDelivery.toNumber() * 1000).toISOString(),
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
