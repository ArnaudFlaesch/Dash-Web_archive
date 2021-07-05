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
    setCalendarUrls(calendarUrls.filter(url => url !== calendarUrl));
  }

  return (
    <div>
      <div>
        {calendarUrls &&
          calendarUrls.map((url, index) => {
            return (
              <div key={index}>
                <input
                  id={index.toString()}
                  onChange={onCalendarUrlUpdated}
                  value={url}
                  placeholder="Saisissez une URL"
                />
                <button className="removeCalendarUrl btn btn-danger" onClick={() => removeCalendarUrl(url)}>Supprimer</button>
              </div>
            );
          })}
        <button id="addCalendarUrl" className="btn btn-primary" onClick={onCalendarUrlAdded}>
          Ajouter
        </button>
      </div>
      <button
        id="validateCalendarUrls"
        onClick={onValidation}
        disabled={!calendarUrls || calendarUrls?.length < 1}
        className="btn btn-success"
      >
        Valider
      </button>
    </div>
  );
}
