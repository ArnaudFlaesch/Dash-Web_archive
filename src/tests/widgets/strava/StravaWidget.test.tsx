import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { StravaWidget } from '../../../widgets/strava/StravaWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<StravaWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
