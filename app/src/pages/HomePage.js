import React, { Component } from 'react';
import { drizzleConnect } from 'drizzle-react';
import { Colors, Card, Elevation, Divider } from '@blueprintjs/core';

class HomePage extends Component { // eslint-disable-line react/prefer-stateless-function
  render() {
    const currentAccount = this.props.accounts[0];

    return (
      <div className="container">
        Hello world
      </div>
    );
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  drizzleStatus: state.drizzleStatus,
});
const HomePageContainer = drizzleConnect(HomePage, mapStateToProps);
export default HomePageContainer;
