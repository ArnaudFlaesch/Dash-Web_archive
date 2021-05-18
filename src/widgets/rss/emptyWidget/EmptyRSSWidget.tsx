import * as React from 'react';
import { useState } from 'react';
import './EmptyRSSWidget.scss';

interface IProps {
  url?: string;
  onUrlSubmitted: (url: string) => void;
}

export default function EmptyRSSWidget(props: IProps): React.ReactElement {
  const [url, setUrl] = useState(props.url);
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) =>
    setUrl(event.target.value);
  const onValidation = () => {
    if (url) {
      props.onUrlSubmitted(url);
    }
  };

  return (
    <div>
      <input
        id="rssFeedUrl"
        name="url"
        onChange={onChangeHandler}
        value={url}
        placeholder="Saisissez l'URL du flux RSS"
      />
      <button
        onClick={onValidation}
        disabled={!url || url?.length < 1}
        className="btn btn-success"
      >
        Valider
      </button>
    </div>
  );
}
