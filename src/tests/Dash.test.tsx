import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dash from '../Dash';

describe("Dash tests", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Dash />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

