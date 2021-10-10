import * as React from 'react';
import { useEffect, useState } from 'react';
import { Timeline } from 'react-twitter-widgets';
import IBaseWidgetConfig from 'src/model/IBaseWidgetConfig';
import logger from 'src/utils/LogUtils';
import Widget from '../Widget';

interface IProps extends IBaseWidgetConfig {
  profile?: string;
}

export default function TwitterTimelineWidget(props: IProps): React.ReactElement {
  const [profile, setProfile] = useState<string>('arnaudflaesch');

  const widgetBody = (
    <div>{profile && <Timeline dataSource={{ sourceType: 'profile', screenName: profile }} options={{ theme: 'dark' }} />}</div>
  );

  useEffect(() => {
    setProfile('arnaudflaesch');
    // setProfile(props.profile)
  }, []);

  const widgetHeader = (
    <div className="rssWidgetTitle">
      <div className="rssTitle">{profile}</div>
    </div>
  );

  function refreshWidget() {
    logger.info(`Refresh Twitter timeline widget ${profile}`);
  }

  return (
    <Widget
      id={props.id}
      tabId={props.tabId}
      config={{ profile }}
      header={widgetHeader}
      body={widgetBody}
      editModeComponent={<div></div>}
      refreshFunction={refreshWidget}
      onDeleteButtonClicked={props.onDeleteButtonClicked}
    />
  );
}
