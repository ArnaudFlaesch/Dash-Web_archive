import axios from "axios";
import * as React from 'react';
import { useEffect, useState } from 'react';
import { ModeEnum } from '../../enums/ModeEnum';
import { updateWidget } from '../../services/WidgetService';
import { adjustTimeWithOffset, formatDateFromTimestamp } from '../../utils/DateUtils';
import logger from '../../utils/LogUtils';
import DeleteWidget from '../utils/DeleteWidget';
import EmptyWeatherWidget from './emptyWidget/EmptyWeatherWidget';
import Forecast from './forecast/Forecast';
import { ICity, IForecast, IWeather } from "./IWeather";
import './WeatherWidget.scss';

export interface IProps {
	id: number;
	weather_api_key?: string;
	city?: string;
	onDeleteButtonClicked: (idWidget: number) => void;
}

export default function WeatherWidget(props: IProps) {
	const WEATHER_API = "http://api.openweathermap.org/data/2.5/";
	const WEATHER_ENDPOINT = "weather";
	const FORECAST_ENDPOINT = "forecast";
	const API_OPTIONS = "?units=metric&lang=fr&appid=";

	const [cityToQuery, setCityToQuery] = useState(props.city);
	const [apiKey, setApiKey] = useState(props.weather_api_key);
	const [weather, setWeather] = useState<IWeather>();
	const [forecast, setForecast] = useState<IForecast[]>();
	const [city, setCity] = useState<ICity>();
	const [mode, setMode] = useState(ModeEnum.READ);

	const fetchDataFromWeatherApi = () => {
		axios.get(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
			params: {
				url: `${WEATHER_API}${WEATHER_ENDPOINT}${API_OPTIONS}${apiKey}&q=${cityToQuery}`
			}
		})
			.then(result => {
				setWeather(result.data);
			})
			.catch((error: Error) => {
				logger.debug(error);
			});
		axios.get(`${process.env.REACT_APP_BACKEND_URL}/proxy/`, {
			params: {
				url: `${WEATHER_API}${FORECAST_ENDPOINT}${API_OPTIONS}${apiKey}&q=${cityToQuery}`
			}
		})
			.then((result: any) => {
				setForecast(result.data.list)
				setCity(result.data.city);
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
	}

	useEffect(() => {
		fetchDataFromWeatherApi();
		setInterval(fetchDataFromWeatherApi, 60000);
	}, [cityToQuery, apiKey])

	const refreshWidget = () => {
		setWeather(undefined);
		setForecast(undefined);
		setCity(undefined);
		fetchDataFromWeatherApi();
	}

	const onConfigSubmitted = (weatherApiKey: string, city: string) => {
		updateWidget(props.id, { city, weather_api_key: weatherApiKey })
			.then(response => {
				setCityToQuery(city);
				setApiKey(weatherApiKey);
				refreshWidget();
				setMode(ModeEnum.READ);
			})
			.catch(error => {
				logger.error(error.message);
			})
	}

	const editWidget = () => {
		setMode(ModeEnum.EDIT);
	}

	const cancelDeletion = () => {
		setMode(ModeEnum.READ);
	}

	const deleteWidget = () => {
		setMode(ModeEnum.DELETE);
	}

	return (
		<div>
			{mode === ModeEnum.READ
				?
				<div>
					<div className="header">
						<div className="leftGroup widgetHeader">
							La météo aujourd'hui à {city?.name}
						</div>
						<div className="rightGroup">
							<button onClick={editWidget} className="btn btn-default editButton"><i className="fa fa-cog" aria-hidden="true" /></button>
							<button onClick={refreshWidget} className="btn btn-default refreshButton"><i className="fa fa-refresh" aria-hidden="true" /></button>
							<button onClick={deleteWidget} className="btn btn-default deleteButton"><i className="fa fa-trash" aria-hidden="true" /></button>
						</div>
					</div>
					{city && weather &&
						<div>
							<div className="flexRow">
								<div><img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} title={weather.weather[0].description} alt={weather.weather[0].description} /></div>
								<div>
									<div>{weather.weather[0].description}</div>
									<div><i className="fa fa-thermometer-three-quarters fa-md" /> {weather.main.temp}°</div>
									<div className="space-between">
										<div><i className="fa fa-sun-o fa-md" /> {formatDateFromTimestamp(weather.sys.sunrise, adjustTimeWithOffset(weather.timezone)).toLocaleTimeString('fr')}</div>
										<div><i className="fa fa-moon-o fa-md" /> {formatDateFromTimestamp(weather.sys.sunset, adjustTimeWithOffset(weather.timezone)).toLocaleTimeString('fr')}</div>
									</div>
									<div><i className="fa fa-clock-o fa-md" /> {formatDateFromTimestamp(weather.dt, adjustTimeWithOffset(weather.timezone)).toLocaleString('fr')}</div>
								</div>
							</div>
						</div>
					}
					{city && forecast &&
						<div>
							<span className="bold">Prévisions</span>
							<br />
							<div className="flexRow forecastRow">
								{city && forecast && forecast?.map(forecastDay => {
									return (
										<div className='forecastContainer' key={forecastDay.dt}>
											<Forecast  {...forecastDay} city={city!!} />
										</div>
									)
								})}
							</div>
						</div>
					}
				</div>
				: (mode === ModeEnum.DELETE)
					? <DeleteWidget idWidget={props.id} onDeleteButtonClicked={props.onDeleteButtonClicked} onCancelButtonClicked={cancelDeletion} />
					: <EmptyWeatherWidget city={cityToQuery} weather_api_key={apiKey} onConfigSubmitted={onConfigSubmitted} />
			}
		</div>
	)
}