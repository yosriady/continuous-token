import { drizzleConnect } from 'drizzle-react'
import React, { Component } from 'react'
import PropTypes from 'prop-types';

/*
 * Create component.
 */

class AccountData extends Component {
  static precisionRound(number, precision) {
    const factor = 10 ** precision;
    return Math.round(number * factor) / factor;
  }

  constructor(props, context) {
    super(props);
  }

  render() {
    if (Object.keys(this.props.accounts).length === 0) { // No accounts found.
      return (
        <span>Initializing...</span>
      );
    }

    // Get account address and balance.
    const address = this.props.accounts[this.props.accountIndex];
    let balance = this.props.accountBalances[address];
    const units = this.props.units ? this.props.units.charAt(0).toUpperCase() + this.props.units.slice(1) : 'Wei';

    // Convert to given units.
    if (this.props.units) {
      balance = this.context.drizzle.web3.utils.fromWei(balance, this.props.units);
    }

    // Adjust to given precision.
    if (this.props.precision) {
      balance = AccountData.precisionRound(balance, this.props.precision);
    }

    return (
      <div>
        <p>{address}</p>
        <p>{balance} {units}</p>
      </div>
    );
  }
}

AccountData.contextTypes = {
  drizzle: PropTypes.object,
};
AccountData.propTypes = {
  accounts: PropTypes.object, // eslint-disable-line
  accountBalances: PropTypes.object, // eslint-disable-line
  accountIndex: PropTypes.string,
  precision: PropTypes.string,
  units: PropTypes.string, // https://github.com/ethereum/wiki/wiki/JavaScript-API#web3fromwei
};
AccountData.defaultProps = {
  accounts: null,
  accountBalances: null,
  accountIndex: null,
  precision: null,
  units: null,
};

const mapStateToProps = (state) => {
  return {
    accounts: state.accounts,
    accountBalances: state.accountBalances,
  };
};
export default drizzleConnect(AccountData, mapStateToProps);
