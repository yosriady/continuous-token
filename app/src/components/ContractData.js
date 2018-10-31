import { drizzleConnect } from 'drizzle-react';
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/*
 * Create component.
 */

class ContractData extends Component {
  constructor(props, context) {
    super(props);

    this.contracts = context.drizzle.contracts;

    // Fetch initial value from chain and return cache key for reactive updates.
    const methodArgs = this.props.methodArgs ? this.props.methodArgs : [];
    this.dataKey = this.contracts[this.props.contract].methods[this.props.method].cacheCall(...methodArgs);
  }

  render() {
    const contract = this.props.contracts[this.props.contract];
    // Contract is not yet intialized.
    if (!contract.initialized) {
      return (
        <span>Initializing...</span>
      );
    }

    // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    if (!(this.dataKey in contract[this.props.method])) {
      return (
        <span>Fetching...</span>
      );
    }

    // Show a loading spinner for future updates.
    const pendingSpinner = contract.synced ? '' : ' 🔄';
    let displayData = contract[this.props.method][this.dataKey].value;

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData);
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      displayData = this.context.drizzle.web3.utils.hexToAscii(displayData);
    }

    // If return value is an array
    if (displayData instanceof Array) {
      const displayListItems = displayData.map((datum, index) => {
        return <li key={index}>{`${datum}`}{pendingSpinner}</li>;
      });

      return (
        <ul>
          {displayListItems}
        </ul>
      );
    }

    // If retun value is an object
    if (typeof displayData === 'object') {
      let i = 0;
      const displayObjectProps = [];

      Object.keys(displayData).forEach((key) => {
        if (i !== key) {
          const element = (
            <li key={i}>
              <strong>{key}</strong>
              {pendingSpinner}
              {`${displayData[key]}`}
            </li>
          );
          displayObjectProps.push(element);
        }

        i += 1;
      });

      return (
        <ul>
          {displayObjectProps}
        </ul>
      );
    }

    return (
      <span>{`${displayData}`}{pendingSpinner}</span>
    );
  }
}

ContractData.contextTypes = {
  drizzle: PropTypes.object,
};
ContractData.propTypes = {
  contract: PropTypes.string,
  method: PropTypes.string,
  methodArgs: PropTypes.arrayOf(PropTypes.any),
  toUtf8: PropTypes.bool,
  toAscii: PropTypes.bool,
};
ContractData.defaultProps = {
  contract: null,
  method: null,
  methodArgs: [],
  toUtf8: false,
  toAscii: false,
};

const mapStateToProps = state => ({
  contracts: state.contracts,
});
export default drizzleConnect(ContractData, mapStateToProps);
