import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WeatherWidget } from '../../components/widgets/weather/WeatherWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WeatherWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
