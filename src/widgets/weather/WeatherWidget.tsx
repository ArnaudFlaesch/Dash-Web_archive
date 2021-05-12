import axios, { AxiosResponse } from 'axios';

import * as React from 'react';
import { useEffect, useState } from 'react';
import ChartComponent from 'react-chartjs-2';
import { updateWidgetData } from '../../services/WidgetService';
import {
  adjustTimeWithOffset,
  formatDateFromTimestamp,
  getDayFromNow
} from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import EmptyWeatherWidget from './emptyWidget/EmptyWeatherWidget';
import Forecast from './forecast/Forecast';
import { ICity, IForecast, IWeather, IWeatherAPIResponse } from './IWeather';
import './WeatherWidget.scss';
import { format } from 'date-fns';


export interface IProps {
  id: number;
  weather_api_key?: string;
  city?: string;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function WeatherWidget(props: IProps): React.ReactElement {
  const WEATHER_API = 'http://api.openweathermap.org/data/2.5/';
  const WEATHER_ENDPOINT = 'weather';
  const FORECAST_ENDPOINT = 'forecast';
  const API_OPTIONS = '?units=metric&lang=fr&appid=';

  const [cityToQuery, setCityToQuery] = useState(props.city);
  const [apiKey, setApiKey] = useState(props.weather_api_key);
  const [weather, setWeather] = useState<IWeather>();
  const [forecast, setForecast] = useState<IForecast[]>();
  const [city, setCity] = useState<ICity>();

  function fetchDataFromWeatherApi() {
    if (apiKey && cityToQuery) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
          params: {
            url: `${WEATHER_API}${WEATHER_ENDPOINT}${API_OPTIONS}${apiKey}&q=${cityToQuery}`
          }
        })
        .then((result) => {
          setWeather(result.data);
        })
        .catch((error: Error) => {
          logger.error(error);
        });
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
          params: {
            url: `${WEATHER_API}${FORECAST_ENDPOINT}${API_OPTIONS}${apiKey}&q=${cityToQuery}`
          }
        })
        .then((result: AxiosResponse) => {
          setForecast((result.data as IWeatherAPIResponse).list);
          setCity((result.data as IWeatherAPIResponse).city);
        })
        .catch((error: Error) => {
          logger.error(error.message);
        });
    }
  }

  useEffect(() => {
    fetchDataFromWeatherApi();
  }, [cityToQuery, apiKey]);

  function refreshWidget() {
    setWeather(undefined);
    setForecast(undefined);
    setCity(undefined);
    fetchDataFromWeatherApi();
  }

  function onConfigSubmitted(weatherApiKey: string, updatedCity: string) {
    updateWidgetData(props.id, {
      city: updatedCity,
      weather_api_key: weatherApiKey
    })
      .then(() => {
        setCityToQuery(updatedCity);
        setApiKey(weatherApiKey);
        refreshWidget();
      })
      .catch((error) => {
        logger.error(error.message);
      });
  }

  const widgetHeader = <div>La météo aujourd'hui à {city?.name}</div>;

  const widgetBody = (
    <div>
      {city && weather && weather.weather && (
        <div className="flexRow">
          <div>
            <img
              style={{ width: '80px' }}
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              title={weather.weather[0].description}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="flexRow" style={{ placeItems: 'center' }}>
            <div className="flexColumn mr-5">
              <div>{weather.weather[0].description}</div>
              <div>
                <i className="fa fa-thermometer-three-quarters fa-md" />{' '}
                {weather.main.temp}°
              </div>
            </div>
            <div className="flexColumn">
              <div className="spaceBetween">
                <div>
                  <i className="fa fa-sun-o fa-md" />{' '}
                  {formatDateFromTimestamp(
                    weather.sys.sunrise,
                    adjustTimeWithOffset(weather.timezone)
                  ).toLocaleTimeString('fr')}
                </div>
                <div>
                  <i className="fa fa-moon-o fa-md" />{' '}
                  {formatDateFromTimestamp(
                    weather.sys.sunset,
                    adjustTimeWithOffset(weather.timezone)
                  ).toLocaleTimeString('fr')}
                </div>
              </div>
              <div>
                <i className="fa fa-clock-o fa-md" />{' '}
                {formatDateFromTimestamp(
                  weather.dt,
                  adjustTimeWithOffset(weather.timezone)
                ).toLocaleString('fr')}
              </div>
            </div>
          </div>
        </div>
      )}
      {city && forecast && (
        <div>
          <span className="bold">Prévisions</span>
          <br />
          <div className="flexRow forecastRow">
            {city &&
              forecast &&
              forecast
                .filter(
                  (forecastDay) =>
                    forecastDay.dt * 1000 < getDayFromNow(2).getTime()
                )
                .map((forecastDay) => {
                  return (
                    <div className="forecastContainer" key={forecastDay.dt}>
                      <Forecast {...forecastDay} city={city} />
                    </div>
                  );
                })}
          </div>
          <div style={{ height: '25vh' }}>
            <ChartComponent
              type='line'
              data={{
                labels: forecast
                  .filter(
                    (forecastDay) =>
                      formatDateFromTimestamp(
                        forecastDay.dt,
                        adjustTimeWithOffset(city.timezone)
                      ).getHours() === 17
                  )
                  .map((forecastDay) =>
                    format(new Date(forecastDay.dt * 1000), 'dd MMM')
                  ),
                datasets: [
                  {
                    label: 'Température',
                    borderColor: 'orange',
                    data: forecast
                      .filter(
                        (forecastDay) =>
                          formatDateFromTimestamp(
                            forecastDay.dt,
                            adjustTimeWithOffset(city.timezone)
                          ).getHours() === 17
                      )
                      .map((forecastDay) => forecastDay.main.temp_max)
                  },
                  {
                    label: 'Ressenti',
                    borderColor: 'red',
                    data: forecast
                      .filter(
                        (forecastDay) =>
                          formatDateFromTimestamp(
                            forecastDay.dt,
                            adjustTimeWithOffset(city.timezone)
                          ).getHours() === 17
                      )
                      .map((forecastDay) => forecastDay.main.feels_like)
                  }
                ]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
          <div className="flexRow forecastRow">
            {city &&
              forecast &&
              forecast
                .filter(
                  (forecastDay) =>
                    forecastDay.dt * 1000 > getDayFromNow(2).getTime()
                )
                .map((forecastDay) => {
                  return (
                    <div className="forecastContainer" key={forecastDay.dt}>
                      <Forecast {...forecastDay} city={city} />
                    </div>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div>
      <Widget
        id={props.id}
        tabId={props.tabId}
        config={{ city: city, apiKey: apiKey }}
        header={widgetHeader}
        body={widgetBody}
        editModeComponent={
          <EmptyWeatherWidget
            city={cityToQuery}
            weather_api_key={apiKey}
            onConfigSubmitted={onConfigSubmitted}
          />
        }
        refreshFunction={refreshWidget}
        onDeleteButtonClicked={props.onDeleteButtonClicked}
      />
    </div>
  );
}
