import { TabContext } from '@mui/lab';
import * as Enzyme from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { toggleSelectedTab } from '../../reducers/actions';
import store from '../../reducers/store';
import TabDash from '../../tab/TabDash';
import * as widgetDataSample from './widgetDataSample.json';
import axios from 'axios';

Enzyme.configure({ adapter: new Adapter() });
const mockedAxios = axios as jest.Mocked<typeof axios>;

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

    jest.spyOn(mockedAxios, 'get').mockImplementation(() => mockFetchPromise);

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
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);
    expect(mockedAxios.get).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=1`, {
      headers: {
        Authorization: '',
        'Content-type': 'application/json'
      }
    });
    expect(container.getElementsByClassName('widget').length).toEqual(0);
    mockedAxios.get.mockRestore();
  });
});
