import React from 'react';
import { NonIdealState, Spinner } from '@blueprintjs/core';

export default ({ description }) => {
  return (
    <div style={{ marginTop: '20%' }}>
      <Spinner />
      <NonIdealState
        title="Loading..."
        description={description || 'Please wait a few seconds while the dApp is loading.'}
      />
    </div>
  );
};
