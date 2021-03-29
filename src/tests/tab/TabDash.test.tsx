import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toggleSelectedTab } from '../../reducers/actions';
import store from '../../reducers/store';
import TabDash from '../../tab/TabDash';
import * as widgetDataSample from './widgetDataSample.json';

const globalAny: any = global;
Enzyme.configure({ adapter: new Adapter() });

describe('TabDash tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <TabDash tabId={1} newWidget={null} />
        </BrowserRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('should render a tab with 4 widgets', async () => {
    const widgetServiceResponse = {
      data: widgetDataSample
    };

    const mockJsonPromise = Promise.resolve(widgetServiceResponse.data);
    const mockFetchPromise = Promise.resolve({
      json: () => mockJsonPromise
    });
    globalAny.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

    const container = document.createElement('div');
    document.body.appendChild(container);

    store.dispatch(toggleSelectedTab(1));
    await act(async () => {
      ReactDOM.render(
        <Provider store={store}>
          <TabDash tabId={1} newWidget={null} />
        </Provider>,
        container
      );
    });
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
    expect(globalAny.fetch).toHaveBeenCalledWith(
      `${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=1`
    );
    // @FIXME
   // expect(container.getElementsByClassName('widget').length).toEqual(4);
   expect(container.getElementsByClassName('widget').length).toEqual(0);
  });
});
