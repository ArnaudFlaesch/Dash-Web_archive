import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import RSSWidget from '../../../widgets/rss/RSSWidget';
import store from '../../../reducers/store';

describe('RSS Widget tests', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const url = "https://www.miximum.fr/feeds/blog/";
        ReactDOM.render(<Provider store={store}><RSSWidget id={1} url={url} tabId={4} onDeleteButtonClicked={function () { return null }} /></Provider>, div);
        ReactDOM.unmountComponentAtNode(div);
    });
})


