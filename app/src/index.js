import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import { DrizzleProvider } from 'drizzle-react';
import { FocusStyleManager } from '@blueprintjs/core';
import './index.css';
import { HomePage, IssuerPage, RewardsPage, CompliancePage } from './pages';
import { history, store } from './store';
import options from './drizzleOptions';
import { Navigation, LoadingContainer } from './components';

FocusStyleManager.onlyShowFocusOnTabs();

ReactDOM.render(
  <DrizzleProvider options={options} store={store}>
    <LoadingContainer>
      <Router history={history} store={store}>
        <div>
          <Navigation />
          <Route exact path="/" component={HomePage} />
          <Route path="/get" component={IssuerPage} />
          <Route path="/rewards" component={RewardsPage} />
          <Route path="/compliance" component={CompliancePage} />
        </div>
      </Router>
    </LoadingContainer>
  </DrizzleProvider>,
  document.getElementById('root'), // eslint-disable-line
);
