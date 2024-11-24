// SPDX-License-Identifier: MIT
pragma solidity 0.8.15;

import { ISemver } from "src/universal/interfaces/ISemver.sol";
import { IL2ToL1MessagePasser } from "src/L2/interfaces/IL2ToL1MessagePasser.sol";

import { SafeCall, Predeploys, FeeVault } from "src/L2/FeeVault.sol";
import { Types } from "src/libraries/Types.sol";

/// @custom:proxied true
/// @title DynamicSequencerFeeVault
/// @notice The DynamicSequencerFeeVault distributes sequencer fees to the block producer of each block
contract DynamicSequencerFeeVault is FeeVault {
    /// @custom:semver 1.0.0
    string public constant version = "1.0.0";

    /// @dev the balance of the block producer
    mapping(address => uint256) public balance;
    /// @dev the withdrawal network of the block producer
    /// @notice by default, the withdrawal network is L1
    mapping(address => Types.WithdrawalNetwork) private network;

    constructor(uint256 _minWithdrawalAmount)
        // Pass address(0) as recipient since we'll dynamically set it
        // unused parameter WITHDRAWAL_NETWORK
        FeeVault(address(0), _minWithdrawalAmount, Types.WithdrawalNetwork.L2)
    { }

    function setWithdrawalNetwork(Types.WithdrawalNetwork _network) external {
        network[msg.sender] = _network;
    }

    function withdrawalNetwork() public view override returns (Types.WithdrawalNetwork network_) {
        network_ = network[msg.sender];
    }

    function withdraw() external override {
        uint256 value = balance[msg.sender];
        require(
            value >= MIN_WITHDRAWAL_AMOUNT, "FeeVault: withdrawal amount must be greater than minimum withdrawal amount"
        );

        totalProcessed += value;
        balance[msg.sender] = 0;

        emit Withdrawal(value, msg.sender, msg.sender);
        emit Withdrawal(value, msg.sender, msg.sender, network[msg.sender]);

        if (network[msg.sender] == Types.WithdrawalNetwork.L2) {
            bool success = SafeCall.send(msg.sender, value);
            require(success, "FeeVault: failed to send ETH to block producer");
        } else {
            IL2ToL1MessagePasser(payable(Predeploys.L2_TO_L1_MESSAGE_PASSER)).initiateWithdrawal{ value: value }({
                _target: msg.sender,
                _gasLimit: WITHDRAWAL_MIN_GAS,
                _data: hex""
            });
        }
    }

    receive() external payable override {
        balance[block.coinbase] += msg.value;
    }

    /// @custom:legacy
    /// @notice Legacy getter for the recipient address.
    /// @return The recipient address.
    function l1FeeWallet() public view returns (address) {
        return msg.sender;
    }
}
