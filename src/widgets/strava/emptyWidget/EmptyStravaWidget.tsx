import * as React from 'react';
import { useEffect } from 'react';

interface IProps {
  clientId?: string;
  clientSecret?: string;
  onConfigSubmitted: (clientId: string, clientSecret: string) => void;
}

export default function EmptyStravaWidget(props: IProps): React.ReactElement {

  useEffect(() => {
    props.onConfigSubmitted(props.clientId || '', props.clientSecret || '');
  }, []);

  return (
    <div>

    </div>
  );
}
