import axios, { AxiosResponse } from 'axios';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import authorizationBearer from 'src/services/auth.header';
import { updateWidgetData } from '../../services/widget.service';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import Widget from '../Widget';
import EmptyWeatherWidget from './emptyWidget/EmptyWeatherWidget';
import Forecast from './forecast/Forecast';
import { ICity, IForecast, IWeather, IWeatherAPIResponse } from './IWeather';
import './WeatherWidget.scss';

interface IProps extends IBaseWidgetConfig {
  city?: string;
}

enum ForecastMode {
  TODAY,
  TOMORROW,
  WEEK
}

export default function WeatherWidget(props: IProps): React.ReactElement {
  const WEATHER_API = 'https://api.openweathermap.org/data/2.5/';
  const WEATHER_ENDPOINT = 'weather';
  const FORECAST_ENDPOINT = 'forecast';
  const API_OPTIONS = '?units=metric&lang=fr&appid=';

  const [cityToQuery, setCityToQuery] = useState(props.city);
  const [weather, setWeather] = useState<IWeather>();
  const [forecast, setForecast] = useState<IForecast[]>();
  const [city, setCity] = useState<ICity>();
  const [forecastMode, setForecastMode] = useState<ForecastMode>(ForecastMode.TODAY);

  function fetchDataFromWeatherApi() {
    if (cityToQuery) {
      axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          },
          params: {
            url: `${WEATHER_API}${WEATHER_ENDPOINT}${API_OPTIONS}${process.env.REACT_APP_OPENWEATHERMAP_KEY}&q=${cityToQuery}`
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
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          },
          params: {
            url: `${WEATHER_API}${FORECAST_ENDPOINT}${API_OPTIONS}${process.env.REACT_APP_OPENWEATHERMAP_KEY}&q=${cityToQuery}`
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
  }, [cityToQuery]);

  function refreshWidget() {
    setWeather(undefined);
    setForecast(undefined);
    setCity(undefined);
    fetchDataFromWeatherApi();
  }

  function onConfigSubmitted(updatedCity: string) {
    updateWidgetData(props.id, {
      city: updatedCity
    })
      .then(() => {
        setCityToQuery(updatedCity);
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
          return forecast.filter((forecastDay) => {
            const forecastElement = formatDateFromTimestamp(forecastDay.dt, adjustTimeWithOffset(city.timezone));
            return forecastElement.getHours() === 17;
          });
        }
        case ForecastMode.TOMORROW: {
          return forecast.filter(
            (forecastDay) =>
              new Date(forecastDay.dt * 1000).getDay() === new Date(+new Date() + 86400000).getDay() &&
              new Date(forecastDay.dt * 1000).getHours() >= 7
          );
        }
        case ForecastMode.TODAY:
        default: {
          return forecast.filter(
            (forecastDay) =>
              new Date(forecastDay.dt * 1000).getDay() === new Date().getDay() &&
              new Date(forecastDay.dt * 1000).getHours() >= 7
          );
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
        <div className="flex flex-row">
          <div>
            <img
              style={{ width: '80px' }}
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              title={weather.weather[0].description}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="flex flex-row" style={{ placeItems: 'center' }}>
            <div className="flexColumn mr-5">
              <div>{weather.weather[0].description}</div>
              <div>
                <i className="fa fa-thermometer-three-quarters fa-md" /> {weather.main.temp}°
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
                {formatDateFromTimestamp(weather.dt, adjustTimeWithOffset(weather.timezone)).toLocaleString('fr')}
              </div>
            </div>
          </div>
        </div>
      )}
      {city && forecast && (
        <div>
          <div className="flex flex-row space-x-10">
            <span className="font-bold">Prévisions</span>
            <span className="flex flex-row space-x-1">
              <button
                id="toggleTodayForecast"
                onClick={selectTodayForecast}
                className={`btn btn-${forecastMode === ForecastMode.TODAY ? 'success' : 'primary'} `}
              >
                Aujourd'hui
              </button>
              <button
                id="toggleTomorrowForecast"
                onClick={selectTomorrowForecast}
                className={`btn btn-${forecastMode === ForecastMode.TOMORROW ? 'success' : 'primary'}`}
              >
                Demain
              </button>
              <button
                id="toggleWeekForecast"
                onClick={selectWeekForecast}
                className={`btn btn-${forecastMode === ForecastMode.WEEK ? 'success' : 'primary'}`}
              >
                Semaine
              </button>
            </span>
          </div>
          <br />
          <div style={{ height: '20vh', maxWidth: '100%' }}>
            <Line
              data={{
                labels: filterForecastByMode().map((forecastDay) => {
                  if (forecastMode === ForecastMode.TODAY || forecastMode === ForecastMode.TOMORROW) {
                    return format(new Date(forecastDay.dt * 1000), 'HH');
                  } else {
                    return format(new Date(forecastDay.dt * 1000), 'EEE dd MMM');
                  }
                }),
                datasets: [
                  {
                    label: 'Température',
                    borderColor: 'orange',
                    data: filterForecastByMode().map((forecastDay) => forecastDay.main.temp_max)
                  },
                  {
                    label: 'Ressenti',
                    borderColor: 'red',
                    data: filterForecastByMode().map((forecastDay) => forecastDay.main.feels_like)
                  }
                ]
              }}
              options={{ maintainAspectRatio: false }}
            />
          </div>
          <div className="flex flex-row forecastRow">
            {city &&
              forecast &&
              filterForecastByMode().map((forecastDay) => {
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
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{ city: city }}
      header={widgetHeader}
      body={widgetBody}
      editModeComponent={<EmptyWeatherWidget city={cityToQuery} onConfigSubmitted={onConfigSubmitted} />}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
