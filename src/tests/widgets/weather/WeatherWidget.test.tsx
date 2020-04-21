import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WeatherWidget } from '../../../widgets/weather/WeatherWidget';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';

import axios from 'axios';
import { render } from 'enzyme';

jest.mock('axios');



Enzyme.configure({ adapter: new Adapter() });
//jest.mock('axios');

describe('Weather widget tests', () => {

  let mock: any;
  beforeEach(() => {
    mock = jest.spyOn(axios, 'get');
  });
  afterEach(() => {
    mock.mockRestore();
  });

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WeatherWidget />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should display the current weather', async () => {
    //const mock = new MockAdapter(axios);
    //mock.onAny('/*').reply(200, apiWeatherResponse);
    //axios.get = jest.fn() as jest.Mock;
    //axios.get.mockImplementation(() => Promise.resolve(apiWeatherResponse));
    render(<WeatherWidget city={"Montréal"} weather_api_key={"d10750704319701c3f9436134add4d7d"} />)
    const spyDidMount = jest.spyOn(WeatherWidget.prototype, "componentDidMount");
/*
    const component = await Enzyme.shallow(
      <WeatherWidget city={"Montréal"} weather_api_key={"d10750704319701c3f9436134add4d7d"} />,  { disableLifecycleMethods: true }
    );
    */
expect(axios.get).toHaveBeenCalled();

    //expect(component.find('#header').text()).toEqual('La météo aujourd\'hui à Montréal')
  });
})

