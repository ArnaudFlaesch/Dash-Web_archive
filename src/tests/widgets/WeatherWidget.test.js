import React from 'react';
import ReactDOM from 'react-dom';
import { WeatherWidget } from '../../components/widgets/WeatherWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<WeatherWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
