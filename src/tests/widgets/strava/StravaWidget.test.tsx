import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { act } from 'react-dom/test-utils';
import { BrowserRouter } from 'react-router-dom';
import StravaWidget from '../../../widgets/strava/StravaWidget';

Enzyme.configure({ adapter: new Adapter() });

describe('Strava widget tests', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      const onDeleteButtonClicked = () => null;
      Enzyme.shallow(
        <BrowserRouter>
          <StravaWidget
            id={1}
            tabId={1}
            onDeleteButtonClicked={onDeleteButtonClicked}
          />
        </BrowserRouter>
      );
    });
  });
});
