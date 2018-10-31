import { drizzleConnect } from 'drizzle-react';
import React, { Children, Component } from 'react';
import PropTypes from 'prop-types';
import LoadingState from './LoadingState';
import NoAccountsState from './NoAccountsState';
import NoConnectionState from './NoConnectionState';

class LoadingContainer extends Component {
  render() {
    if (this.props.web3.status === 'failed') {
      if (this.props.errorComp) {
        return this.props.errorComp;
      }

      return <NoConnectionState />;
    }

    if (this.props.web3.status === 'initialized' && Object.keys(this.props.accounts).length === 0) {
      return <NoAccountsState />;
    }

    if (this.props.drizzleStatus.initialized) {
      return Children.only(this.props.children);
    }

    return <LoadingState />;
  }
}

LoadingContainer.contextTypes = {
  drizzle: PropTypes.object,
};
LoadingContainer.propTypes = {
  web3: PropTypes.object, // eslint-disable-line
  drizzleStatus: PropTypes.object, // eslint-disable-line
  accounts: PropTypes.object, //eslint-disable-line
  errorComp: PropTypes.node,
  children: PropTypes.node,
};
LoadingContainer.defaultProps = {
  web3: null,
  drizzleStatus: null,
  accounts: null,
  errorComp: null,
  children: null,
};

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3,
});

export default drizzleConnect(LoadingContainer, mapStateToProps);
