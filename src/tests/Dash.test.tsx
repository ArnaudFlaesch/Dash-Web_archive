import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Dash from '../Dash';
import store from '../reducers/store';

describe("Dash tests", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><Dash /></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

