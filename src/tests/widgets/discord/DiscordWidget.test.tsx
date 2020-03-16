import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DiscordWidget } from '../../../widgets/discord/DiscordWidget';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<DiscordWidget />, div);
  ReactDOM.unmountComponentAtNode(div);
});
