import * as Enzyme from 'enzyme';
import { shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import CalendarWidget from '../../../widgets/calendar/CalendarWidget';

jest.mock('@fullcalendar/react', () => jest.fn())
jest.mock('@fullcalendar/bootstrap', () => jest.fn())
jest.mock('@fullcalendar/daygrid', () => jest.fn())
jest.mock('@fullcalendar/interaction', () => jest.fn())
jest.mock('@fullcalendar/timegrid', () => jest.fn())
jest.mock('@fullcalendar/list', () => jest.fn())
jest.mock('@fullcalendar/core/locales/fr', () => jest.fn())

Enzyme.configure({ adapter: new Adapter() });

describe('Calendar widget tests', () => {

  it('renders without crashing', async () => {

    await act(async () => {
      shallow(<CalendarWidget id={1} calendars={['fake_url']} isOnActiveTab={true} onDeleteButtonClicked={function () { return null }} />);
    });

  });
});
