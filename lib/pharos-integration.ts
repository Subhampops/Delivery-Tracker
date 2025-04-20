// This file would be used to integrate with Pharos for indexing and querying blockchain events

import { ethers } from "ethers"
import ShippingContractABI from "../artifacts/contracts/ShippingContract.sol/ShippingContract.json"

// Replace with your actual contract address after deployment
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS"

// Replace with the actual Pharos Devnet RPC URL
const PHAROS_RPC_URL = "https://pharos-devnet.rpc.url"

// Initialize provider and contract
const provider = new ethers.providers.JsonRpcProvider(PHAROS_RPC_URL)
const contract = new ethers.Contract(CONTRACT_ADDRESS, ShippingContractABI.abi, provider)

/**
 * Get all shipment registered events
 */
export async function getShipmentRegisteredEvents(fromBlock = 0, toBlock = "latest") {
  const filter = contract.filters.ShipmentRegistered()
  const events = await contract.queryFilter(filter, fromBlock, toBlock)

  return events.map((event) => {
    const { trackingId, sender, receiver, description, timestamp } = event.args
    return {
      trackingId,
      sender,
      receiver,
      description,
      timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    }
  })
}

/**
 * Get all status update events for a specific tracking ID
 */
export async function getStatusUpdateEvents(trackingId, fromBlock = 0, toBlock = "latest") {
  const filter = contract.filters.ShipmentStatusUpdated(trackingId)
  const events = await contract.queryFilter(filter, fromBlock, toBlock)

  return events.map((event) => {
    const { trackingId, status, location, notes, timestamp } = event.args
    return {
      trackingId,
      status: getStatusString(status),
      location,
      notes,
      timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    }
  })
}

/**
 * Get all delivery confirmation events
 */
export async function getDeliveryEvents(fromBlock = 0, toBlock = "latest") {
  const filter = contract.filters.ShipmentDelivered()
  const events = await contract.queryFilter(filter, fromBlock, toBlock)

  return events.map((event) => {
    const { trackingId, receiver, timestamp } = event.args
    return {
      trackingId,
      receiver,
      timestamp: new Date(timestamp.toNumber() * 1000).toISOString(),
      transactionHash: event.transactionHash,
      blockNumber: event.blockNumber,
    }
  })
}

/**
 * Get shipment details from the contract
 */
export async function getShipmentDetails(trackingId) {
  try {
    const shipment = await contract.getShipment(trackingId)
    const statusUpdates = await contract.getStatusUpdates(trackingId)

    return {
      trackingId: shipment.trackingId,
      sender: shipment.sender,
      receiver: shipment.receiver,
      description: shipment.description,
      senderAddress: shipment.senderAddress,
      receiverAddress: shipment.receiverAddress,
      weight: shipment.weight.toString(),
      dimensions: shipment.dimensions,
      status: getStatusString(shipment.status),
      statusCode: shipment.status,
      timestamp: new Date(shipment.timestamp.toNumber() * 1000).toISOString(),
      estimatedDelivery: new Date(shipment.estimatedDelivery.toNumber() * 1000).toISOString(),
      isActive: shipment.isActive,
      statusUpdates: statusUpdates.map((update) => ({
        status: getStatusString(update.status),
        statusCode: update.status,
        location: update.location,
        notes: update.notes,
        timestamp: new Date(update.timestamp.toNumber() * 1000).toISOString(),
      })),
    }
  } catch (error) {
    console.error(`Error fetching shipment details: ${error.message}`)
    throw error
  }
}

/**
 * Convert status code to string
 */
function getStatusString(statusCode) {
  const statusMap = {
    0: "Registered",
    1: "Picked Up",
    2: "In Transit",
    3: "Out for Delivery",
    4: "Delivered",
    5: "Exception",
  }

  return statusMap[statusCode] || "Unknown"
}

/**
 * Register a new shipment (requires signer with private key)
 */
export async function registerShipment(signer, shipmentData) {
  const connectedContract = contract.connect(signer)

  const tx = await connectedContract.registerShipment(
    shipmentData.trackingId || (await connectedContract.generateTrackingId()),
    shipmentData.receiver,
    shipmentData.receiverWallet || "",
    shipmentData.description,
    shipmentData.senderAddress,
    shipmentData.receiverAddress,
    shipmentData.weight,
    shipmentData.dimensions,
    shipmentData.estimatedDelivery,
  )

  const receipt = await tx.wait()
  return {
    transactionHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    events: receipt.events,
  }
}

/**
 * Update shipment status (requires signer with private key)
 */
export async function updateShipmentStatus(signer, trackingId, status, location, notes) {
  const connectedContract = contract.connect(signer)

  const tx = await connectedContract.updateShipmentStatus(trackingId, status, location, notes)

  const receipt = await tx.wait()
  return {
    transactionHash: receipt.transactionHash,
    blockNumber: receipt.blockNumber,
    events: receipt.events,
  }
}
