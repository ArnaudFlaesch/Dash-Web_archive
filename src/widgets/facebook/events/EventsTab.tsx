import { ReactElement, useEffect } from 'react';
import logger from '../../../utils/LogUtils';

export default function EventsTab(): ReactElement {
  useEffect(() => {
    logger.debug('onComponentDidMount');
  });

  return <div>Liste des prochains évènements</div>;
}
