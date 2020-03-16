import axios from "axios";
import * as React from 'react';
import * as winston from 'winston';
import { formatDayFromUTC, formatTimeFromDate } from "../../utils/DateUtils";
import {ICurrent, IForecast, ILocation} from "./IWeather";

export interface IProps {
	weather_api_key?: string;
}

interface IState {
	API_KEY? : string;
	city : string;
	days : number;
	lang : string;
	location?: ILocation;
	currentWeather?: ICurrent;
	forecastWeather?: IForecast;
	FORECAST_WEATHER_API : string;
}

export class WeatherWidget extends React.Component<IProps, IState> {

	constructor(props : IProps) {
		super(props);
		this.state = {
			API_KEY : props.weather_api_key,
			FORECAST_WEATHER_API : "https://api.apixu.com/v1/forecast.json",
			city : "Paris",
			currentWeather : undefined,
			days : 5,
			forecastWeather : undefined,
			lang : "fr",
			location : undefined
		}
	}

	public componentDidMount() {
		axios.get(this.state.FORECAST_WEATHER_API + "?key=" + this.state.API_KEY + "&q=" + this.state.city + "&days=" + this.state.days + "&lang=" + this.state.lang)
			.then(result => {
				this.setState({
					currentWeather : result.data.current,
					forecastWeather : result.data.forecast,
					location : result.data.location
				});
			})
			.catch((error : Error)  => {
				winston.log('debug', error.message);
			});
	}

	public render() {
		return (
			<div className="widget">
				{this.state.location && this.state.currentWeather &&
					<div>
						<div>La météo aujourd'hui à {this.state.location.name} à {formatTimeFromDate(this.state.location.localtime)}</div>
						<div>
							<div><img src={this.state.currentWeather.condition.icon} alt={this.state.currentWeather.condition.text} /></div>
							<div>{this.state.currentWeather.condition.text}</div>
							<div>Température : {this.state.currentWeather.temp_c}°</div>
							<div>Dernière mise à jour à : {this.state.currentWeather.last_updated}</div>
						</div>

						<br />

						<div>
							Prévisions
							<br />
							<div className="flexRow">
								{this.state.forecastWeather && this.state.forecastWeather.forecastday.map(forecastDay => {
									return (
										<div key={forecastDay.date}>
											<div>{formatDayFromUTC(forecastDay.date)}</div>
											<div>
												<img src={forecastDay.day.condition.icon} alt={forecastDay.day.condition.text} />
											</div>
											<div>
												<span>Min : {forecastDay.day.mintemp_c}° </span>
												<span>Max : {forecastDay.day.maxtemp_c}°</span>
												<div>Humidité {forecastDay.day.avghumidity}%</div>
											</div>
											<div>
												Lever du soleil : {forecastDay.astro.sunrise}
												Coucher du soleil : {forecastDay.astro.sunset}
											</div>
											<div>
												Lever de lune : {forecastDay.astro.moonrise}
												Coucher de lune : {forecastDay.astro.moonset}
											</div>
											<br />
										</div>
									)
								})}
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
}