import axios from 'axios';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import TabDash from "../../tab/TabDash";
import * as widgetDataSample from './widgetDataSample.json';

const mockedAxios = axios as jest.Mocked<typeof axios>;
Enzyme.configure({ adapter: new Adapter() });

describe("TabDash tests", () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<TabDash />, div);
        ReactDOM.unmountComponentAtNode(div);
    });

    it('should render a tab with 3 widgets', async () => {
        const widgetServiceResponse = {
            data: widgetDataSample
        };

        jest.spyOn(mockedAxios, "get").mockImplementation(() => {
            return Promise.resolve(widgetServiceResponse)
        });

        const container = document.createElement("div");
        document.body.appendChild(container);
        await act(async () => {
            ReactDOM.render(<TabDash tabId={1} />, container);
        });
        expect(container.getElementsByClassName('.widget').length).toEqual(5);
    });
});
