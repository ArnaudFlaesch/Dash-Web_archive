import * as React from 'react';
import { useState } from 'react';
import './EmptyCalendarWidget.scss';

interface IProps {
  calendarUrls?: string[];
  onConfigSubmitted: (calendarUrls: string[]) => void;
}

export default function EmptyCalendarWidget(props: IProps): React.ReactElement {
  const [calendarUrls, setCalendarUrls] = useState<string[]>(
    props.calendarUrls || []
  );
  const onValidation = () => {
    props.onConfigSubmitted(calendarUrls!);
  };

  const onCalendarUrlUpdated = (event: any) => {
    setCalendarUrls(
      calendarUrls.map((url: string, index: number) =>
        index.toString() === event.target.id ? event.target.value : url
      )
    );
  };

  const onCalendarUrlAdded = (event: any) => {
    setCalendarUrls(calendarUrls.concat(''));
  };

  return (
    <div>
      <div>
        {calendarUrls &&
          calendarUrls.map((url, index) => {
            return (
              <input
                key={index}
                id={index.toString()}
                onChange={onCalendarUrlUpdated}
                value={url}
                placeholder="Saisissez une URL"
              />
            );
          })}
        <button className="btn btn-success" onClick={onCalendarUrlAdded}>
          Ajouter
        </button>
      </div>
      <button
        onClick={onValidation}
        disabled={!calendarUrls || calendarUrls?.length < 1}
        className="btn btn-success"
      >
        Valider
      </button>
    </div>
  );
}
