import axios from 'axios';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import WeatherWidget from '../../../widgets/weather/WeatherWidget';
import * as montrealWeatherSample from './montrealWeatherSample.json';

Enzyme.configure({ adapter: new Adapter() });
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Weather widget tests', () => {

  let container: HTMLElementTagNameMap["div"];
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
  });

  it('renders without crashing', () => {
    act(() => {
      render(<WeatherWidget id={1} onDeleteButtonClicked={function () { return null }} />, container);
    });
  });

  it('Should display the current weather', async () => {
    const apiWeatherResponse = {
      data: montrealWeatherSample
    };

    jest.spyOn(mockedAxios, "get").mockImplementation(() => {
      return Promise.resolve(apiWeatherResponse)
    });

    await act(async () => {
      render(<WeatherWidget id={2} city={"Montréal"} weather_api_key={"342535667748234148989"} onDeleteButtonClicked={function () { return null }} />, container);
    });

    expect(container.querySelector('.header')?.textContent).toEqual('La météo aujourd\'hui à Montréal');
    expect(container.querySelectorAll('.forecastContainer').length).toEqual(40);

    mockedAxios.get.mockRestore();
  });
})

