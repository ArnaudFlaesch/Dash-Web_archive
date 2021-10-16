import { Button, Input } from '@mui/material';
import { useState } from 'react';

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
    <div className="flex flex-col mx-auto max-w-xs mt-10 space-y-8">
      <Input
        id="cityNameInput"
        name="city"
        onChange={onCityChangeHandler}
        value={city}
        placeholder="Saisissez de nom de la ville"
      />
      <Button
        variant="contained"
        id="validateButton"
        color="success"
        onClick={onValidation}
        disabled={!city || city?.length < 1}
      >
        Valider
      </Button>
    </div>
  );
}
