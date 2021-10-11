import { useState } from 'react';
import './EmptyWeatherWidget.scss';

interface IProps {
  city?: string;
  onConfigSubmitted: (city: string) => void;
}

export default function EmptyWeatherWidget(props: IProps): React.ReactElement {
  const [city, setCity] = useState(props.city || '');
  const onCityChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setCity(event.target.value);
  const onValidation = () => {
    props.onConfigSubmitted(city);
  };

  return (
    <div>
      <input
        id="cityNameInput"
        name="city"
        onChange={onCityChangeHandler}
        value={city}
        placeholder="Saisissez de nom de la ville"
      />
      <button
        id="validateButton"
        className="btn btn-success"
        onClick={onValidation}
        disabled={!city || city?.length < 1}
      >
        Valider
      </button>
    </div>
  );
}
