pragma solidity ^0.8.3;

/*
    What is multi call ? 
    Multicall aggregates multiple calls in one call thus it gurantees that your data
    is retrieved from the same block. E.g. getting token prices from uniswap, it makes
    sure that the token prices are retrieved from the same block. 
*/

contract ContractC {
    function func2() external view returns(uint, uint) {
        return (2, block.timestamp);
    }

    function getFunc2Address() external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.func2.selector);
    }
}

contract ContractB {
    function func1() external view returns(uint, uint) {
        return (1, block.timestamp);
    }

    function getFunc1Address() external pure returns (bytes memory) {
        return abi.encodeWithSelector(this.func1.selector);
    }
}

contract ContractA {
    function multiCall(address[] calldata _contracts, bytes[] calldata _contractFuncs)
    external
    view 
    returns (bytes[] memory)
    {
        require(_contracts.length == _contractFuncs.length, "All targets should have data param");
        bytes[] memory results = new bytes[](_contractFuncs.length);

        for (uint i; i < _contracts.length; i++) {
            (bool success, bytes memory result) = _contracts[i].staticcall(_contractFuncs[i]);
            require(success, "call failed;");
            results[i] = result;
        }

        return results;
    }
}