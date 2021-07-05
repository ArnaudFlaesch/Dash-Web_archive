import { ReactElement, useEffect } from 'react';
import logger from '../../../utils/LogUtils';
import { getGroupsData } from '../FacebookAPI';
import IGroup from './IGroup';

export default function GroupsTab(): ReactElement {
  useEffect(() => {
    getGroupsData()
      .then((result: unknown) => {
        logger.debug(result as IGroup[]);
      })
      .catch((error: Error) => {
        logger.debug(error);
      });
  }, []);

  return <div>Liste des groupes auxquels vous appartenez</div>;
}
