pragma solidity 0.4.25;


interface IBondingCurve {
  function getContinuousMintReward(uint _reserveTokenAmount) external view returns (uint);
  function getContinuousBurnRefund(uint _continuousTokenAmount) external view returns (uint);
}
