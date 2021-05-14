import axios, { AxiosResponse } from 'axios';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { updateWidgetData } from '../../services/WidgetService';
import {
  adjustTimeWithOffset,
  formatDateFromTimestamp,
} from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import EmptyWeatherWidget from './emptyWidget/EmptyWeatherWidget';
import Forecast from './forecast/Forecast';
import { ICity, IForecast, IWeather, IWeatherAPIResponse } from './IWeather';
import './WeatherWidget.scss';
import { format } from 'date-fns';

interface IProps {
  id: number;
  weather_api_key?: string;
  city?: string;
  tabId: number;
  onDeleteButtonClicked: (idWidget: number) => void;
}

enum ForecastMode {
  TODAY,
  TOMORROW,
  WEEK
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
  const [forecastMode, setForecastMode] = useState<ForecastMode>(ForecastMode.TODAY);

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

  function filterForecastByMode(): IForecast[] {
    if (city && forecast) {
      switch (forecastMode) {
        case ForecastMode.WEEK: {
          return forecast.filter(
            (forecastDay) => {
              const forecastElement = formatDateFromTimestamp(
                forecastDay.dt,
                adjustTimeWithOffset(city.timezone)
              )
              return forecastElement.getHours() === 17
            }
          )
        }
        case ForecastMode.TOMORROW: {
          return forecast.filter((forecastDay) => new Date(forecastDay.dt * 1000).getDay() === new Date().getDay() + 1 && new Date(forecastDay.dt * 1000).getHours() >= 7);
        }
        case ForecastMode.TODAY:
        default: {
          return forecast.filter((forecastDay) => new Date(forecastDay.dt * 1000).getDay() === new Date().getDay() && new Date(forecastDay.dt * 1000).getHours() >= 7);
        }
      }
    } else {
      return [];
    }
  }

  function selectTodayForecast(): void {
    setForecastMode(ForecastMode.TODAY);
  }

  function selectTomorrowForecast(): void {
    setForecastMode(ForecastMode.TOMORROW);
  }

  function selectWeekForecast(): void {
    setForecastMode(ForecastMode.WEEK);
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
            <div className="flexColumn mr5">
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
          <div className="flexRow">
            <span className="bold">Prévisions</span>
            <span style={{ alignContent: "space-between", display: "flex" }}>
              <button onClick={selectTodayForecast} style={{ flex: "1" }} className={`btn btn-${forecastMode === ForecastMode.TODAY ? 'success' : 'primary'} mr-5`}>Aujourd'hui</button>
              <button onClick={selectTomorrowForecast} style={{ flex: "1" }} className={`btn btn-${forecastMode === ForecastMode.TOMORROW ? 'success' : 'primary'}`}>Demain</button>
              <button onClick={selectWeekForecast} style={{ flex: "1" }} className={`btn btn-${forecastMode === ForecastMode.WEEK ? 'success' : 'primary'}`}>Semaine</button>
            </span>
          </div>
          <br />
          <div style={{ height: '20vh', maxWidth: "100%" }}>
            <Line
              type="line"
              data={{
                labels:
                  filterForecastByMode().map((forecastDay) => {
                    if (forecastMode === ForecastMode.TODAY || forecastMode === ForecastMode.TOMORROW) {
                      return format(new Date(forecastDay.dt * 1000), 'HH');
                    } else {
                      return format(new Date(forecastDay.dt * 1000), 'EEEE dd MMM');
                    }
                  }

                  ),
                datasets: [
                  {
                    label: 'Température',
                    borderColor: 'orange',
                    data: filterForecastByMode()
                      .map((forecastDay) => forecastDay.main.temp_max)
                  },
                  {
                    label: 'Ressenti',
                    borderColor: 'red',
                    data: filterForecastByMode()
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
              filterForecastByMode()
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
