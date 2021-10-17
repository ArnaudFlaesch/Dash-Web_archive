import { Button, Input } from '@mui/material';
import { useState } from 'react';

interface IProps {
  calendarUrls?: string[];
  onConfigSubmitted: (calendarUrls: string[]) => void;
}

export default function EmptyCalendarWidget(props: IProps): React.ReactElement {
  const [calendarUrls, setCalendarUrls] = useState<string[]>(props.calendarUrls || []);
  const onValidation = () => {
    props.onConfigSubmitted(calendarUrls);
  };

  const onCalendarUrlUpdated = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCalendarUrls(
      calendarUrls.map((url: string, index: number) =>
        index.toString() === event.target?.id ? event.target.value : url
      )
    );
  };

  const onCalendarUrlAdded = () => {
    setCalendarUrls(calendarUrls.concat(''));
  };

  function removeCalendarUrl(calendarUrl: string) {
    setCalendarUrls(calendarUrls.filter((url) => url !== calendarUrl));
  }

  return (
    <div>
      <div>
        {calendarUrls &&
          calendarUrls.map((url, index) => {
            return (
              <div key={index} className="flex flex-row">
                <Input
                  id={index.toString()}
                  onChange={onCalendarUrlUpdated}
                  value={url}
                  placeholder="Saisissez une URL"
                />

                <Button
                  className="removeCalendarUrl"
                  variant="contained"
                  color="error"
                  onClick={() => removeCalendarUrl(url)}
                >
                  Supprimer
                </Button>
              </div>
            );
          })}
        <Button id="addCalendarUrl" variant="contained" onClick={onCalendarUrlAdded}>
          Ajouter
        </Button>
      </div>
      <Button
        id="validateCalendarUrls"
        onClick={onValidation}
        disabled={!calendarUrls || calendarUrls?.length < 1}
        variant="contained"
        color="success"
      >
        Valider
      </Button>
    </div>
  );
}
