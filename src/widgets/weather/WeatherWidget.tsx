import axios from "axios";
import * as React from 'react';
import { formatDateFromTimestamp, adjustTimeWithOffset } from '../../utils/DateUtils';
import { ICity, IForecast, IWeather } from "./IWeather";
import './WeatherWidget.scss';
import { logger } from '../../utils/logger';

export interface IProps {
	weather_api_key?: string;
	city?: string;
}

interface IState {
	API_KEY?: string;
	CORS_PROXY: string;
	city?: string;
	location?: ICity;
	weather?: IWeather,
	forecast?: IForecast[];
	WEATHER_API: string;
	WEATHER_ENDPOINT: string;
	FORECAST_ENDPOINT: string;
	API_OPTIONS: string;
}

export class WeatherWidget extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			API_KEY: props.weather_api_key,
			city: props.city,
			CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
			WEATHER_API: "http://api.openweathermap.org/data/2.5/",
			WEATHER_ENDPOINT: "weather",
			FORECAST_ENDPOINT: "forecast",
			API_OPTIONS: "?units=metric&lang=fr&appid=",
			weather: undefined,
			forecast: undefined,
			location: undefined
		}
	}

	public componentDidMount() {
		axios.get(
			this.state.CORS_PROXY
			+ this.state.WEATHER_API
			+ this.state.WEATHER_ENDPOINT
			+ this.state.API_OPTIONS
			+ this.state.API_KEY
			+ "&q=" + this.state.city
		)
			.then(result => {
				this.setState({
					location: result.data.name,
					weather: result.data
				});
			})
			.catch((error: Error) => {
				logger.debug(error);
			});
		axios.get(this.state.CORS_PROXY
			+ this.state.WEATHER_API
			+ this.state.FORECAST_ENDPOINT
			+ this.state.API_OPTIONS
			+ this.state.API_KEY
			+ "&q=" + this.state.city
		)
			.then(result => {
				this.setState({
					forecast: result.data.list,
					location: result.data.city
				});
			})
			.catch((error: Error) => {
				logger.debug(error.message);
			});
	}

	public render() {
		return (
			<div className="widget">
				{this.state.location && this.state.weather &&
					<div>
						<div id="header">La météo aujourd'hui à {this.props.city}</div>
						<div><img src={`https://openweathermap.org/img/wn/${this.state.weather.weather[0].icon}@2x.png`} title={this.state.weather.weather[0].description} alt={this.state.weather.weather[0].description} /></div>
						<div>{this.state.weather.weather[0].description}</div>
						<div>Température : {this.state.weather.main.temp}°</div>
						<div>
							<div>Lever du soleil : {formatDateFromTimestamp(this.state.weather.sys.sunrise, adjustTimeWithOffset(this.state.weather.timezone))}</div>
							<div>Coucher du soleil : {formatDateFromTimestamp(this.state.weather.sys.sunset, adjustTimeWithOffset(this.state.weather.timezone))}</div>
						</div>
						<div>Dernière mise à jour le : {formatDateFromTimestamp(this.state.weather.dt, adjustTimeWithOffset(this.state.weather.timezone))}</div>
					</div>
				}
				<br />

				<div>
					<span>Prévisions</span>
					<br />
					<div className="flexColumn">
						{this.state.location && this.state.forecast && this.state.forecast.map(forecastDay => {
							return (
								<div key={forecastDay.dt} className='forecast'>
									<div>{formatDateFromTimestamp(forecastDay.dt, adjustTimeWithOffset(this.state.location!!.timezone))}</div>
									<div>
										<img src={`https://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png`} title={forecastDay.weather[0].description} alt={forecastDay.weather[0].description} />
									</div>
									<div>
										<div>Min : {forecastDay.main.temp_min}°</div>
										<div>Max : {forecastDay.main.temp_max}°</div>
										<div>Humidité {forecastDay.main.humidity}%</div>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
		)
	}
}