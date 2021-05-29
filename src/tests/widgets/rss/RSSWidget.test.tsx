import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import store from '../../../reducers/store';
import RSSWidget from '../../../widgets/rss/RSSWidget';

describe('RSS Widget tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const url = 'https://www.miximum.fr/feeds/blog/';
    const onDeleteButtonClicked = () => null;

    act(() => {
      render(
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
    });
    unmountComponentAtNode(div);
  });
});
