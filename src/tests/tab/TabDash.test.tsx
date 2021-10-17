import { TabContext } from '@mui/lab';
import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toggleSelectedTab } from '../../reducers/actions';
import store from '../../reducers/store';
import TabDash from '../../tab/TabDash';
import * as widgetDataSample from './widgetDataSample.json';

const globalAny: NodeJS.Global & typeof globalThis = global;
Enzyme.configure({ adapter: new Adapter() });

describe('TabDash tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(
      <Provider store={store}>
        <BrowserRouter>
          <TabContext value="1">
            <TabDash tabId={1} newWidget={undefined} />
          </TabContext>
        </BrowserRouter>
      </Provider>,
      div
    );
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should render a tab', async () => {
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
          <TabContext value="1">
            <TabDash tabId={1} newWidget={undefined} />
          </TabContext>
        </Provider>,
        container
      );
    });
    expect(globalAny.fetch).toHaveBeenCalledTimes(1);
    expect(globalAny.fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=1`, {
      headers: {
        Authorization: '',
        'Content-type': 'application/json'
      }
    });
    expect(container.getElementsByClassName('widget').length).toEqual(0);
  });
});
