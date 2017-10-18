import React from 'react';
import Test from './Test';
import Home from './Home';

export default [
  { path: '/', action: () => <Home />},
  { path: '/test', action: () => <Test /> }
]
