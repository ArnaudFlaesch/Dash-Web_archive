import axios from "axios";
import * as React from 'react';
import * as winston from 'winston';
import { formatDateFromTimestamp, adjustTimeWithOffset } from '../../utils/DateUtils';
import { ICity, IForecast } from "./IWeather";
import './WeatherWidget.scss';

export interface IProps {
	weather_api_key?: string;
	city?: string;
}

interface IState {
	API_KEY?: string;
	CORS_PROXY: string;
	city?: string;
	location?: ICity;
	forecastWeather?: IForecast[];
	FORECAST_WEATHER_API: string;
}

export class WeatherWidget extends React.Component<IProps, IState> {

	constructor(props: IProps) {
		super(props);
		this.state = {
			API_KEY: props.weather_api_key,
			CORS_PROXY: 'https://cors-anywhere.herokuapp.com/',
			city: props.city,
			FORECAST_WEATHER_API: "http://api.openweathermap.org/data/2.5/forecast",
			forecastWeather: undefined,
			location: undefined
		}
	}

	public componentDidMount() {
		axios.get(this.state.CORS_PROXY + this.state.FORECAST_WEATHER_API + "?q=" + this.state.city + "&units=metric&lang=fr&appid=" + this.state.API_KEY)
			.then(result => {
				this.setState({
					forecastWeather: result.data.list,
					location: result.data.city
				});
			})
			.catch((error: Error) => {
				winston.log('debug', error.message);
			});
	}

	public render() {
		return (
			<div className="widget">
				{this.state.location && this.state.forecastWeather &&
					<div>La météo aujourd'hui à {this.state.location.name}</div>
				}
				<br />
				<div>
					<span>Prévisions</span>
					<br />
					<div className="flexColumn">
						{this.state.location && this.state.forecastWeather && this.state.forecastWeather.map(forecastDay => {
							return (
								<div key={forecastDay.dt} className='forecast'>
									<div>{formatDateFromTimestamp(forecastDay.dt, adjustTimeWithOffset(this.state.location!!.timezone))}</div>
									<div>
										<img src={forecastDay.weather[0].icon} alt={forecastDay.weather[0].description} />
									</div>
									<div>
										<div>Min : {forecastDay.main.temp_min}°</div>
										<div>Max : {forecastDay.main.temp_max}°</div>
										<div>Humidité {forecastDay.main.humidity}%</div>
									</div>
									<div>
										<div>Lever du soleil : {formatDateFromTimestamp(this.state.location!!.sunrise, adjustTimeWithOffset(this.state.location!!.timezone))}</div>
										<div>Coucher du soleil : {formatDateFromTimestamp(this.state.location!!.sunset, adjustTimeWithOffset(this.state.location!!.timezone))}</div>
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