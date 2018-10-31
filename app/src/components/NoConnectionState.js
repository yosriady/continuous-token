import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

export default () => {
  const description = 'This browser has no connection to the Ethereum network. Please use the Chrome/FireFox extension MetaMask, or dedicated Ethereum browsers Mist or Parity.';
  return (
    <div style={{ marginTop: '20%' }}>
      <NonIdealState
        icon="offline"
        title="Not Connected to Ethereum"
        description={description}
      />
    </div>
  );
};
