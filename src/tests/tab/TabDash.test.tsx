import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import TabDash from "../../tab/TabDash";
import * as widgetDataSample from './widgetDataSample.json';

const globalAny: any = global;
Enzyme.configure({ adapter: new Adapter() });

jest.mock('@fullcalendar/react', () => jest.fn())
jest.mock('@fullcalendar/bootstrap', () => jest.fn())
jest.mock('@fullcalendar/daygrid', () => jest.fn())
jest.mock('@fullcalendar/interaction', () => jest.fn())
jest.mock('@fullcalendar/timegrid', () => jest.fn())
jest.mock('@fullcalendar/list', () => jest.fn())
jest.mock('@fullcalendar/core/locales/fr', () => jest.fn())

describe("TabDash tests", () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<TabDash isActiveTab={true} tabId={'1'} newWidget={null} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('should render a tab with 4 widgets', async () => {
        const widgetServiceResponse = {
            data: widgetDataSample
        };

        const mockJsonPromise = Promise.resolve(widgetServiceResponse.data);
        const mockFetchPromise = Promise.resolve({
            json: () => mockJsonPromise,
        });
        globalAny.fetch = jest.fn().mockImplementation(() => mockFetchPromise);

        const container = document.createElement("div");
        document.body.appendChild(container);
        await act(async () => {
            ReactDOM.render(<TabDash isActiveTab={true} tabId={'1'} newWidget={null} />, container);
        });

        expect(globalAny.fetch).toHaveBeenCalledTimes(1);
        expect(globalAny.fetch).toHaveBeenCalledWith(`${process.env.REACT_APP_BACKEND_URL}/widget/?tabId=1`);
        expect(container.getElementsByClassName('widget').length).toEqual(4);
    });
});
