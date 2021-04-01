import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import store from '../../../reducers/store';
import RSSWidget from '../../../widgets/rss/RSSWidget';

describe('RSS Widget tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const url = 'https://www.miximum.fr/feeds/blog/';
    const onDeleteButtonClicked = () => null;
    ReactDOM.render(
      <Provider store={store}>
        <RSSWidget
          id={1}
          url={url}
          tabId={4}
          onDeleteButtonClicked={onDeleteButtonClicked}
        />
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });
});
