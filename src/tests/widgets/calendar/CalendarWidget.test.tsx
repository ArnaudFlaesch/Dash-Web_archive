import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CalendarWidget from '../../../widgets/calendar/CalendarWidget';

describe('Calendar widget tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<CalendarWidget id={1} calendars={['fake_url']} isOnActiveTab={true} onDeleteButtonClicked={function () { return null }} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
