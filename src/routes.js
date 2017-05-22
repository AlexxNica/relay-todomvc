import makeRouteConfig from 'found/lib/jsx/makeRouteConfig';
import RedirectException from 'found/lib/RedirectException';
import Route from 'found/lib/jsx/Route';
import React from 'react';
import Relay from 'react-relay';

import TodoApp from './components/TodoApp';
import TodoList from './components/TodoList';
import ViewerQueries from './queries/ViewerQueries';

export default makeRouteConfig(
  <Route
    path="/"
    Component={TodoApp}
    queries={ViewerQueries}
  >
    <Route
      Component={TodoList}
      queries={ViewerQueries}
      prepareParams={params => ({ ...params, status: 'any' })}
    />
    <Route
      path="active"
      Component={TodoList}
      queries={ViewerQueries}
      extraQuery={Relay.QL`
        query {
          viewer {
            numTodos
            numCompletedTodos
          }
        }
      `}
      prepareParams={params => ({ ...params, status: 'active' })}
      prerender={({ done, extraData }) => {
        if (done) {
          const { numTodos, numCompletedTodos } = extraData.viewer;
          if (numTodos === numCompletedTodos) {
            throw new RedirectException('/completed');
          }
        }
      }}
    />
    <Route
      path=":status"
      Component={TodoList}
      queries={ViewerQueries}
    />
  </Route>,
);
