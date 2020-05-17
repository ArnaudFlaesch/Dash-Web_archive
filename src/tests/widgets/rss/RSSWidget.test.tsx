import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { RSSWidget } from '../../../widgets/rss/RSSWidget';

describe('RSS Widget tests', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const url = "https://www.miximum.fr/feeds/blog/";
        ReactDOM.render(<RSSWidget id={1} url={url} onDeleteButtonClicked={function () { return null }} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
})


