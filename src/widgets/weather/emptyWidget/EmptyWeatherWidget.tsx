import * as React from 'react';
import { useState } from 'react';
import './EmptyWeatherWidget.scss';

interface IProps {
  weather_api_key?: string;
  city?: string;
  onConfigSubmitted: (weatherApiKey: string, city: string) => void;
}

export default function EmptyWeatherWidget(props: IProps): React.ReactElement {
  const [city, setCity] = useState(props.city || '');
  const [weatherApiKey, setWeatherApiKey] = useState(
    props.weather_api_key || ''
  );
  const onWeatherApiKeyChangeHandler = (event: React.ChangeEvent) => {
    if (event.target.nodeValue) {
      setWeatherApiKey(event.target.nodeValue);
    }
  };
  const onCityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setCity(event.target.value);
  const onValidation = () => {
    props.onConfigSubmitted(weatherApiKey, city);
  };

  return (
    <div>
      <input
        name="weatherApiKey"
        onChange={onWeatherApiKeyChangeHandler}
        value={weatherApiKey}
        placeholder="Saisissez la clé d'API"
      />
      <input
        name="city"
        onChange={onCityChangeHandler}
        value={city}
        placeholder="Saisissez de nom de la ville"
      />
      <button
        className="validateButton btn btn-success"
        onClick={onValidation}
        disabled={
          !city ||
          !weatherApiKey ||
          city?.length < 1 ||
          weatherApiKey?.length < 1
        }
      >
        Valider
      </button>
    </div>
  );
}
