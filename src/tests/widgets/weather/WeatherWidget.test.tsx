import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { WeatherWidget } from '../../../widgets/weather/WeatherWidget';
import { IWeather } from 'src/widgets/weather/IWeather';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { shallow } from 'enzyme';
import * as Adapter from 'enzyme-adapter-react-16';
import * as Enzyme from 'enzyme';

Enzyme.configure({ adapter: new Adapter() });
export default {
  get: jest.fn().mockResolvedValue({ data: {} })
};

describe('Weather widget tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<WeatherWidget />, div);
    ReactDOM.unmountComponentAtNode(div);
  });

  /*
  it('Should display the current weather', async () => {
    const apiWeatherResponse: IWeather = {
      "coord": {
        "lon": -73.59,
        "lat": 45.51
      },
      "weather": [
        {
          "id": 803,
          "main": "Clouds",
          "description": "nuageux",
          "icon": "04d"
        }
      ],
      "base": "stations",
      "main": {
        "temp": -1.55,
        "feels_like": -8.53,
        "temp_min": -3,
        "temp_max": 0,
        "pressure": 1032,
        "humidity": 33
      },
      "visibility": 48279,
      "wind": {
        "speed": 5.1,
        "deg": 270,
        "gust": 8.2
      },
      "clouds": {
        "all": 75
      },
      "dt": 1584826021,
      "sys": {
        "type": 1,
        "id": 943,
        "country": "CA",
        "sunrise": 1584788074,
        "sunset": 1584832086
      },
      "timezone": -14400,
      "id": 6077243,
      "name": "Montréal",
      "cod": 200
    };

    const mock = new MockAdapter(axios);
    mock.onGet('/*').reply(200, apiWeatherResponse);
    const component = await shallow(
      <WeatherWidget city={"Montréal"} weather_api_key={"weather_api_key"} />,
    );
    component.update().;

    expect(component.find('#header').text()).toEqual('La météo aujourd\'hui à Montréal')
  });

  */
})

