import React from 'react';
import { NonIdealState } from '@blueprintjs/core';

export default () => {
  const description = "We can't find any Ethereum accounts! Please check and make sure Metamask or your browser are pointed at the correct network and your account is unlocked.";
  return (
    <div style={{ marginTop: '20%' }}>
      <NonIdealState
        icon="error"
        title="No Accounts Found"
        description={description}
      />
    </div>
  );
};
