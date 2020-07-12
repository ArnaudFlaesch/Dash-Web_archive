import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dash from '../Dash';

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
    ReactDOM.render(<Dash />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

