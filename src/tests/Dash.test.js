import React from 'react';
import ReactDOM from 'react-dom';
import Dash from '../Dash';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Dash />, div);
  ReactDOM.unmountComponentAtNode(div);
});
