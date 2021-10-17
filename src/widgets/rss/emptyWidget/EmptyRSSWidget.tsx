import { Button, Input } from '@mui/material';
import { useState } from 'react';

interface IProps {
  url?: string;
  onUrlSubmitted: (url: string) => void;
}

export default function EmptyRSSWidget(props: IProps): React.ReactElement {
  const [url, setUrl] = useState(props.url);
  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => setUrl(event.target.value);
  const onValidation = () => {
    if (url) {
      props.onUrlSubmitted(url);
    }
  };

  return (
    <div className="flex flex-col mx-auto max-w-xs mt-10 space-y-8">
      <Input
        id="rssFeedUrl"
        name="url"
        onChange={onChangeHandler}
        value={url}
        placeholder="Saisissez l'URL du flux RSS"
      />
      <Button
        className="validateRssUrl"
        color="success"
        variant="contained"
        onClick={onValidation}
        disabled={!url || url?.length < 1}
      >
        Valider
      </Button>
    </div>
  );
}
