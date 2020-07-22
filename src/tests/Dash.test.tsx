import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import Dash from '../Dash';
import store from '../reducers/store';

jest.mock('@fullcalendar/react', () => jest.fn())
jest.mock('@fullcalendar/bootstrap', () => jest.fn())
jest.mock('@fullcalendar/daygrid', () => jest.fn())
jest.mock('@fullcalendar/interaction', () => jest.fn())
jest.mock('@fullcalendar/timegrid', () => jest.fn())
jest.mock('@fullcalendar/list', () => jest.fn())
jest.mock('@fullcalendar/core/locales/fr', () => jest.fn())

describe("Dash tests", () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Provider store={store}><Dash /></Provider>, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

