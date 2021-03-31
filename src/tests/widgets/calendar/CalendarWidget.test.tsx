import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import CalendarWidget from '../../../widgets/calendar/CalendarWidget';

Enzyme.configure({ adapter: new Adapter() });

describe('Calendar widget tests', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      const onDeleteButtonClicked = () => null;
      Enzyme.shallow(
        <CalendarWidget
          id={1}
          tabId={1}
          calendars={['fake_url']}
          onDeleteButtonClicked={onDeleteButtonClicked}
        />
      );
    });
  });
});
