import axios from 'axios';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { act } from "react-dom/test-utils";
import WeatherWidget from '../../../widgets/weather/WeatherWidget';
import * as montrealWeatherSample from './montrealWeatherSample.json';

Enzyme.configure({ adapter: new Adapter() });
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Weather widget tests', () => {

  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WeatherWidget id={1} onDeleteButtonClicked={function () { return null }} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  it('Should display the current weather', async () => {
    const apiWeatherResponse = {
      data: montrealWeatherSample
    };

    jest.spyOn(mockedAxios, "get").mockImplementation(() => {
      return Promise.resolve(apiWeatherResponse)
    });

    let component : Enzyme.ShallowWrapper;
    await act(async () => {
      component = Enzyme.shallow(<WeatherWidget id={2} city={"Montréal"} weather_api_key={"342535667748234148989"} onDeleteButtonClicked={function () { return null }} />);
    }).then(()=>  {
      expect(component.find('.header').text()).toEqual('La météo aujourd\'hui à Montréal');
      expect(component.find('.forecastContainer').length).toEqual(40);
    });

    mockedAxios.get.mockRestore();
  });
})

