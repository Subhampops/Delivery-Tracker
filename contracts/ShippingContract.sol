// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title dPackChain Shipping Contract
 * @dev Smart contract for tracking packages on the blockchain
 */
contract ShippingContract {
    // Enum for shipment status
    enum ShipmentStatus {
        Registered,
        PickedUp,
        InTransit,
        OutForDelivery,
        Delivered,
        Exception
    }

    // Struct to store shipment details
    struct Shipment {
        string trackingId;
        address sender;
        address receiver;
        string receiverWallet; // Optional: can be empty if not using wallet verification
        string description;
        string senderAddress;
        string receiverAddress;
        uint256 weight; // in grams
        string dimensions;
        ShipmentStatus status;
        uint256 timestamp;
        uint256 estimatedDelivery;
        bool isActive;
    }

    // Struct to store shipment status updates
    struct StatusUpdate {
        ShipmentStatus status;
        string location;
        string notes;
        uint256 timestamp;
    }

    // Mapping from tracking ID to shipment
    mapping(string => Shipment) public shipments;
    
    // Mapping from tracking ID to array of status updates
    mapping(string => StatusUpdate[]) public statusUpdates;
    
    // Array to store all tracking IDs
    string[] public allTrackingIds;
    
    // Mapping from address to array of tracking IDs (for sender and receiver)
    mapping(address => string[]) public senderShipments;
    mapping(address => string[]) public receiverShipments;

    // Events
    event ShipmentRegistered(
        string trackingId,
        address indexed sender,
        address indexed receiver,
        string description,
        uint256 timestamp
    );

    event ShipmentStatusUpdated(
        string trackingId,
        ShipmentStatus status,
        string location,
        string notes,
        uint256 timestamp
    );

    event ShipmentDelivered(
        string trackingId,
        address indexed receiver,
        uint256 timestamp
    );

    /**
     * @dev Register a new shipment
     * @param _trackingId Unique tracking ID for the shipment
     * @param _receiver Address of the receiver
     * @param _receiverWallet Optional wallet address for the receiver (can be empty)
     * @param _description Description of the package contents
     * @param _senderAddress Physical address of the sender
     * @param _receiverAddress Physical address of the receiver
     * @param _weight Weight of the package in grams
     * @param _dimensions Dimensions of the package (L x W x H)
     * @param _estimatedDelivery Estimated delivery timestamp
     */
    function registerShipment(
        string memory _trackingId,
        address _receiver,
        string memory _receiverWallet,
        string memory _description,
        string memory _senderAddress,
        string memory _receiverAddress,
        uint256 _weight,
        string memory _dimensions,
        uint256 _estimatedDelivery
    ) public {
        // Ensure tracking ID doesn't already exist
        require(shipments[_trackingId].timestamp == 0, "Tracking ID already exists");
        
        // Create new shipment
        Shipment memory newShipment = Shipment({
            trackingId: _trackingId,
            sender: msg.sender,
            receiver: _receiver,
            receiverWallet: _receiverWallet,
            description: _description,
            senderAddress: _senderAddress,
            receiverAddress: _receiverAddress,
            weight: _weight,
            dimensions: _dimensions,
            status: ShipmentStatus.Registered,
            timestamp: block.timestamp,
            estimatedDelivery: _estimatedDelivery,
            isActive: true
        });
        
        // Store shipment
        shipments[_trackingId] = newShipment;
        allTrackingIds.push(_trackingId);
        senderShipments[msg.sender].push(_trackingId);
        receiverShipments[_receiver].push(_trackingId);
        
        // Add initial status update
        StatusUpdate memory initialStatus = StatusUpdate({
            status: ShipmentStatus.Registered,
            location: "Origin Facility",
            notes: "Shipment registered",
            timestamp: block.timestamp
        });
        
        statusUpdates[_trackingId].push(initialStatus);
        
        // Emit event
        emit ShipmentRegistered(
            _trackingId,
            msg.sender,
            _receiver,
            _description,
            block.timestamp
        );
    }

    /**
     * @dev Update the status of a shipment
     * @param _trackingId Tracking ID of the shipment
     * @param _status New status of the shipment
     * @param _location Current location of the shipment
     * @param _notes Additional notes about the status update
     */
    function updateShipmentStatus(
        string memory _trackingId,
        ShipmentStatus _status,
        string memory _location,
        string memory _notes
    ) public {
        // Ensure shipment exists and is active
        require(shipments[_trackingId].timestamp > 0, "Shipment does not exist");
        require(shipments[_trackingId].isActive, "Shipment is not active");
        
        // Only sender or authorized carriers can update status
        // In a production environment, you would implement a more robust authorization system
        require(
            msg.sender == shipments[_trackingId].sender,
            "Not authorized to update this shipment"
        );
        
        // Update shipment status
        shipments[_trackingId].status = _status;
        
        // Add status update
        StatusUpdate memory update = StatusUpdate({
            status: _status,
            location: _location,
            notes: _notes,
            timestamp: block.timestamp
        });
        
        statusUpdates[_trackingId].push(update);
        
        // If status is Delivered, mark as delivered
        if (_status == ShipmentStatus.Delivered) {
            emit ShipmentDelivered(
                _trackingId,
                shipments[_trackingId].receiver,
                block.timestamp
            );
        }
        
        // Emit event
        emit ShipmentStatusUpdated(
            _trackingId,
            _status,
            _location,
            _notes,
            block.timestamp
        );
    }

    /**
     * @dev Confirm delivery of a shipment (by receiver)
     * @param _trackingId Tracking ID of the shipment
     */
    function confirmDelivery(string memory _trackingId) public {
        // Ensure shipment exists and is active
        require(shipments[_trackingId].timestamp > 0, "Shipment does not exist");
        require(shipments[_trackingId].isActive, "Shipment is not active");
        
        // Only receiver can confirm delivery
        require(
            msg.sender == shipments[_trackingId].receiver,
            "Only the receiver can confirm delivery"
        );
        
        // Update shipment status
        shipments[_trackingId].status = ShipmentStatus.Delivered;
        
        // Add status update
        StatusUpdate memory update = StatusUpdate({
            status: ShipmentStatus.Delivered,
            location: "Destination",
            notes: "Delivery confirmed by receiver",
            timestamp: block.timestamp
        });
        
        statusUpdates[_trackingId].push(update);
        
        // Emit event
        emit ShipmentDelivered(
            _trackingId,
            msg.sender,
            block.timestamp
        );
    }

    /**
     * @dev Get shipment details
     * @param _trackingId Tracking ID of the shipment
     * @return Shipment details
     */
    function getShipment(string memory _trackingId) public view returns (Shipment memory) {
        require(shipments[_trackingId].timestamp > 0, "Shipment does not exist");
        return shipments[_trackingId];
    }

    /**
     * @dev Get all status updates for a shipment
     * @param _trackingId Tracking ID of the shipment
     * @return Array of status updates
     */
    function getStatusUpdates(string memory _trackingId) public view returns (StatusUpdate[] memory) {
        require(shipments[_trackingId].timestamp > 0, "Shipment does not exist");
        return statusUpdates[_trackingId];
    }

    /**
     * @dev Get all shipments sent by an address
     * @param _sender Address of the sender
     * @return Array of tracking IDs
     */
    function getShipmentsBySender(address _sender) public view returns (string[] memory) {
        return senderShipments[_sender];
    }

    /**
     * @dev Get all shipments received by an address
     * @param _receiver Address of the receiver
     * @return Array of tracking IDs
     */
    function getShipmentsByReceiver(address _receiver) public view returns (string[] memory) {
        return receiverShipments[_receiver];
    }

    /**
     * @dev Get total number of shipments
     * @return Total number of shipments
     */
    function getTotalShipments() public view returns (uint256) {
        return allTrackingIds.length;
    }

    /**
     * @dev Generate a unique tracking ID (this would typically be done off-chain)
     * @return Unique tracking ID
     */
    function generateTrackingId() public view returns (string memory) {
        // This is a simplified example - in production, you would use a more robust method
        bytes32 hash = keccak256(abi.encodePacked(msg.sender, block.timestamp, block.prevrandao));
        return string(abi.encodePacked("DPC-", toHexString(uint256(hash) % 1000000000000)));
    }

    /**
     * @dev Convert a uint to a hex string
     * @param value Value to convert
     * @return Hex string
     */
    function toHexString(uint256 value) internal pure returns (string memory) {
        if (value == 0) {
            return "0";
        }
        
        bytes memory buffer = new bytes(32);
        uint256 length = 0;
        
        while (value > 0) {
            uint256 remainder = value % 16;
            buffer[length++] = bytes1(uint8(remainder < 10 ? 48 + remainder : 87 + remainder));
            value /= 16;
        }
        
        bytes memory result = new bytes(length);
        for (uint256 i = 0; i < length; i++) {
            result[i] = buffer[length - i - 1];
        }
        
        return string(result);
    }
}
