import { Button } from '@mui/material';
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
import WbSunnyIcon from '@mui/icons-material/WbSunny';
import Brightness3Icon from '@mui/icons-material/Brightness3';
import ScheduleIcon from '@mui/icons-material/Schedule';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { Chart as ChartJS, CategoryScale, LinearScale, LineElement, PointElement } from 'chart.js';

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

  ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement);

  function fetchDataFromWeatherApi() {
    if (cityToQuery) {
      axios
        .get<IWeather>(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
          headers: {
            Authorization: authorizationBearer(),
            'Content-type': 'application/json'
          },
          params: {
            url: `${WEATHER_API}${WEATHER_ENDPOINT}${API_OPTIONS}${process.env.REACT_APP_OPENWEATHERMAP_KEY}&q=${cityToQuery}`
          }
        })
        .then((result) => setWeather(result.data))
        .catch((error: Error) => logger.error(error.message));
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
        .catch((error: Error) => logger.error(error.message));
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
      .catch((error) => logger.error(error.message));
  }

  function filterForecastByMode(): IForecast[] {
    if (city && forecast) {
      switch (forecastMode) {
        case ForecastMode.WEEK: {
          return forecast.filter((forecastDay) => {
            const forecastElement = formatDateFromTimestamp(forecastDay.dt, adjustTimeWithOffset(city.timezone));
            return forecastElement.getHours() >= 15 && forecastElement.getHours() <= 18;
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

  const widgetHeader = <div>La météo aujourd'hui à {cityToQuery}</div>;

  const widgetBody = (
    <div>
      {city && weather && weather.weather && (
        <div className="flex flex-row">
          <div>
            <img
              className="w-16"
              src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
              title={weather.weather[0].description}
              alt={weather.weather[0].description}
            />
          </div>
          <div className="flex flex-row place-items-center">
            <div className="flex flex-col mr-5">
              <div>{weather.weather[0].description}</div>
              <div>
                <DeviceThermostatIcon />
                {weather.main.temp}°
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex justify-between">
                <div>
                  <WbSunnyIcon />
                  {formatDateFromTimestamp(
                    weather.sys.sunrise,
                    adjustTimeWithOffset(weather.timezone)
                  ).toLocaleTimeString('fr')}
                </div>
                <div>
                  <Brightness3Icon />
                  {formatDateFromTimestamp(
                    weather.sys.sunset,
                    adjustTimeWithOffset(weather.timezone)
                  ).toLocaleTimeString('fr')}
                </div>
              </div>
              <div>
                <ScheduleIcon />
                {formatDateFromTimestamp(weather.dt, adjustTimeWithOffset(weather.timezone)).toLocaleString('fr')}
              </div>
            </div>
          </div>
        </div>
      )}
      {city && forecast && (
        <div>
          <div className="flex flex-row flex-wrap space-x-10">
            <span className="font-bold">Prévisions</span>
            <span className="flex flex-row space-x-1">
              <Button
                id="toggleTodayForecast"
                onClick={selectTodayForecast}
                variant="contained"
                color={forecastMode === ForecastMode.TODAY ? 'success' : 'primary'}
              >
                Aujourd'hui
              </Button>
              <Button
                id="toggleTomorrowForecast"
                variant="contained"
                color={forecastMode === ForecastMode.TOMORROW ? 'success' : 'primary'}
                onClick={selectTomorrowForecast}
              >
                Demain
              </Button>
              <Button
                id="toggleWeekForecast"
                onClick={selectWeekForecast}
                variant="contained"
                color={forecastMode === ForecastMode.WEEK ? 'success' : 'primary'}
              >
                Semaine
              </Button>
            </span>
          </div>
          <br />
          <div className="min-h-24 max-x-full">
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
      config={new Map<string, unknown>([['city', cityToQuery]])}
      header={widgetHeader}
      body={widgetBody}
      editModeComponent={<EmptyWeatherWidget city={cityToQuery} onConfigSubmitted={onConfigSubmitted} />}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
