import { expect } from "chai"
import { ethers } from "hardhat"
import type { Contract } from "ethers"
import type { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"

describe("ShippingContract", () => {
  let shippingContract: Contract
  let owner: SignerWithAddress
  let receiver: SignerWithAddress
  let addr2: SignerWithAddress
  let trackingId: string

  beforeEach(async () => {
    // Get signers
    ;[owner, receiver, addr2] = await ethers.getSigners()

    // Deploy the contract
    const ShippingContract = await ethers.getContractFactory("ShippingContract")
    shippingContract = await ShippingContract.deploy()
    await shippingContract.deployed()

    // Generate a tracking ID
    trackingId = await shippingContract.generateTrackingId()
  })

  describe("Shipment Registration", () => {
    it("Should register a new shipment", async () => {
      const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

      await expect(
        shippingContract.registerShipment(
          trackingId,
          receiver.address,
          "",
          "Test Package",
          "123 Sender St",
          "456 Receiver Ave",
          1000,
          "20x15x10",
          estimatedDelivery,
        ),
      )
        .to.emit(shippingContract, "ShipmentRegistered")
        .withArgs(trackingId, owner.address, receiver.address, "Test Package", await getBlockTimestamp())

      const shipment = await shippingContract.getShipment(trackingId)
      expect(shipment.sender).to.equal(owner.address)
      expect(shipment.receiver).to.equal(receiver.address)
      expect(shipment.description).to.equal("Test Package")
      expect(shipment.status).to.equal(0) // Registered
    })

    it("Should not allow duplicate tracking IDs", async () => {
      const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

      await shippingContract.registerShipment(
        trackingId,
        receiver.address,
        "",
        "Test Package",
        "123 Sender St",
        "456 Receiver Ave",
        1000,
        "20x15x10",
        estimatedDelivery,
      )

      await expect(
        shippingContract.registerShipment(
          trackingId,
          receiver.address,
          "",
          "Another Package",
          "123 Sender St",
          "456 Receiver Ave",
          1000,
          "20x15x10",
          estimatedDelivery,
        ),
      ).to.be.revertedWith("Tracking ID already exists")
    })
  })

  describe("Shipment Status Updates", () => {
    beforeEach(async () => {
      const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

      await shippingContract.registerShipment(
        trackingId,
        receiver.address,
        "",
        "Test Package",
        "123 Sender St",
        "456 Receiver Ave",
        1000,
        "20x15x10",
        estimatedDelivery,
      )
    })

    it("Should update shipment status", async () => {
      await expect(
        shippingContract.updateShipmentStatus(
          trackingId,
          2, // InTransit
          "Distribution Center",
          "Package in transit",
        ),
      )
        .to.emit(shippingContract, "ShipmentStatusUpdated")
        .withArgs(trackingId, 2, "Distribution Center", "Package in transit", await getBlockTimestamp())

      const shipment = await shippingContract.getShipment(trackingId)
      expect(shipment.status).to.equal(2) // InTransit

      const updates = await shippingContract.getStatusUpdates(trackingId)
      expect(updates.length).to.equal(2) // Initial status + update
      expect(updates[1].status).to.equal(2)
      expect(updates[1].location).to.equal("Distribution Center")
    })

    it("Should not allow unauthorized status updates", async () => {
      await expect(
        shippingContract
          .connect(addr2)
          .updateShipmentStatus(trackingId, 2, "Distribution Center", "Package in transit"),
      ).to.be.revertedWith("Not authorized to update this shipment")
    })
  })

  describe("Delivery Confirmation", () => {
    beforeEach(async () => {
      const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

      await shippingContract.registerShipment(
        trackingId,
        receiver.address,
        "",
        "Test Package",
        "123 Sender St",
        "456 Receiver Ave",
        1000,
        "20x15x10",
        estimatedDelivery,
      )
    })

    it("Should allow receiver to confirm delivery", async () => {
      await expect(shippingContract.connect(receiver).confirmDelivery(trackingId))
        .to.emit(shippingContract, "ShipmentDelivered")
        .withArgs(trackingId, receiver.address, await getBlockTimestamp())

      const shipment = await shippingContract.getShipment(trackingId)
      expect(shipment.status).to.equal(4) // Delivered

      const updates = await shippingContract.getStatusUpdates(trackingId)
      expect(updates.length).to.equal(2) // Initial status + delivery confirmation
      expect(updates[1].status).to.equal(4)
      expect(updates[1].notes).to.equal("Delivery confirmed by receiver")
    })

    it("Should not allow non-receiver to confirm delivery", async () => {
      await expect(shippingContract.connect(addr2).confirmDelivery(trackingId)).to.be.revertedWith(
        "Only the receiver can confirm delivery",
      )
    })
  })

  describe("Shipment Queries", () => {
    beforeEach(async () => {
      const estimatedDelivery = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60

      // Register multiple shipments
      await shippingContract.registerShipment(
        trackingId,
        receiver.address,
        "",
        "Test Package 1",
        "123 Sender St",
        "456 Receiver Ave",
        1000,
        "20x15x10",
        estimatedDelivery,
      )

      const trackingId2 = await shippingContract.generateTrackingId()
      await shippingContract.registerShipment(
        trackingId2,
        addr2.address,
        "",
        "Test Package 2",
        "123 Sender St",
        "789 Another Ave",
        1500,
        "25x20x15",
        estimatedDelivery,
      )
    })

    it("Should get shipments by sender", async () => {
      const senderShipments = await shippingContract.getShipmentsBySender(owner.address)
      expect(senderShipments.length).to.equal(2)
    })

    it("Should get shipments by receiver", async () => {
      const receiverShipments = await shippingContract.getShipmentsByReceiver(receiver.address)
      expect(receiverShipments.length).to.equal(1)
      expect(receiverShipments[0]).to.equal(trackingId)
    })

    it("Should get total shipments", async () => {
      const totalShipments = await shippingContract.getTotalShipments()
      expect(totalShipments).to.equal(2)
    })
  })

  // Helper function to get the timestamp of the latest block
  async function getBlockTimestamp() {
    const blockNumber = await ethers.provider.getBlockNumber()
    const block = await ethers.provider.getBlock(blockNumber)
    return block.timestamp
  }
})
