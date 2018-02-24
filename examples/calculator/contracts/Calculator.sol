pragma solidity 0.4.18;

contract Calculator {

    function Sum(int x1, int x2) public pure returns(int ) {

        return ( x1 + x2);
    }

    function Mul(int x1, int x2) public pure returns(int ) {

        return (x1 * x2);
    }

    function Div(int x1, int x2) public pure returns(int ) {

        return (x1 / x2);
    }

    function Sub(int x1, int x2) public pure returns(int ) {

        return (x1 - x2);
    }
    
}


