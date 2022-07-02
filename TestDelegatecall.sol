pragma solidity ^0.8.3;

/*
    delegatecall executes the outer smart contract method,
    but uses the internal ether and modifies the internal contract states
    .The state variables must be the same in the same order in order to work properly
    One of the ideas behind delegatecal is that you can make modifications of your contract by 
    having proxy contract which redirects to the newest contract version.
*/

contract ContractB {
    uint public num;
    address public sender;
    uint public value;

    function setVars(uint _num) external payable {
        num = _num;
        sender = msg.sender;
        value = msg.value;
    }
}

contract ContractA {
    uint public num;
    uint public sender;
    uint public value;

    function setVars(address _contract, uint _num) external payable {
        (bool success, bytes memory data) = _contract.delegatecall(abi.encodeWithSelector(ContractB.setVars.selector, _num));

        require(success, "test delegate call failed.");
    }
}