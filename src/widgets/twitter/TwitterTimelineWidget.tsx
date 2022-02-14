import * as React from 'react';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Timeline } from 'react-twitter-widgets';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import { handleError } from 'src/reducers/actions';
import { updateWidgetData } from 'src/services/widget.service';
import logger from 'src/utils/LogUtils';
import Widget from '../Widget';
import EmptyTwitterTimelineWidget from './emptyWidget/EmptyTwitterTimelineWidget';

interface IProps extends IBaseWidgetConfig {
  profile?: string;
}

export default function TwitterTimelineWidget(props: IProps): React.ReactElement {
  const [profile, setProfile] = useState<string>(props.profile || '');
  const dispatch = useDispatch();
  const ERROR_UPDATING_TIMELINE = 'Erreur lors de la modification du widget.';

  useEffect(() => {
    if (props.profile) {
      setProfile(props.profile);
    }
  }, []);

  function onProfileSubmitted(widgetProfile: string): void {
    updateWidgetData(props.id, { profile: widgetProfile })
      .then(() => setProfile(widgetProfile))
      .catch((error) => dispatch(handleError(error, ERROR_UPDATING_TIMELINE)));
  }

  const widgetHeader = <div className="timelineHeader">Timeline de {profile}</div>;

  const widgetBody = (
    <div>
      {profile && <Timeline dataSource={{ sourceType: 'profile', screenName: profile }} options={{ theme: 'dark' }} />}
    </div>
  );

  function refreshWidget() {
    logger.info(`Refresh Twitter timeline widget ${profile}`);
  }

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={new Map<string, unknown>([['profile', profile]])}
      header={widgetHeader}
      body={widgetBody}
      editModeComponent={<EmptyTwitterTimelineWidget profile={profile} onProfileSubmitted={onProfileSubmitted} />}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
