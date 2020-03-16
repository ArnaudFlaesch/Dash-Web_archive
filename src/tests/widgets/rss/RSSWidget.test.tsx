import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RSSWidget } from '../../../widgets/rss/RSSWidget';

it('renders without crashing', () => {
    const div = document.createElement('div');
    const url = "https://www.miximum.fr/feeds/blog/";
    ReactDOM.render(<RSSWidget url={url} />, div);
    ReactDOM.unmountComponentAtNode(div);
});

