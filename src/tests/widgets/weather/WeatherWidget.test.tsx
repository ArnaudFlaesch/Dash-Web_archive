import axios from 'axios';
import * as Enzyme from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux';
import store from '../../../reducers/store';
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
      render(<Provider store={store}><WeatherWidget id={1} tabId={2} onDeleteButtonClicked={function () { return null }} /></Provider>, container);
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
      render(<Provider store={store}><WeatherWidget id={2} city={"Montréal"} tabId={3} weather_api_key={"342535667748234148989"} onDeleteButtonClicked={function () { return null }} /></Provider>, container);
    });

    expect(container.querySelector('.header')?.textContent).toEqual('La météo aujourd\'hui à Montréal');
    expect(container.querySelectorAll('.forecastContainer').length).toEqual(40);

    mockedAxios.get.mockRestore();
  });

  it('Should update the city of a widget', async () => {
    const apiMontrealWeatherResponse = {
      data: montrealWeatherSample
    };

    // const apiParisWeatherResponse = {
    //   data: parisWeatherSample
    // };

    jest.spyOn(mockedAxios, "get").mockImplementation(() => {
      return Promise.resolve(apiMontrealWeatherResponse)
    });

    await act(async () => {
      render(<Provider store={store}><WeatherWidget id={2} city={"Montréal"} tabId={4} weather_api_key={"342535667748234148989"} onDeleteButtonClicked={() => null} /></Provider>, container);
    });

    const deleteButton = container.getElementsByClassName('deleteButton')[0] as HTMLElement;
    await act(async () => {
      deleteButton.click();
    });
    expect(container.getElementsByTagName("h4")[0].innerHTML).toMatch("Êtes-vous sûr de vouloir supprimer ce widget ?");
    const cancelButton = container.getElementsByClassName('cancelButton')[0] as HTMLElement;
    await act(async () => {
      cancelButton.click();
    });
    const refreshButton = container.getElementsByClassName('refreshButton')[0] as HTMLElement;
    await act(async () => {
      refreshButton.click();
    });
    const editButton = container.getElementsByClassName('editButton')[0] as HTMLElement;
    await act(async () => {
      editButton.click();
    });
    expect(container.innerHTML).toContain("342535667748234148989");
    expect(container.innerHTML).toContain("Montréal");
  });
})

