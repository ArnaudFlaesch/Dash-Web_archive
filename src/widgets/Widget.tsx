import * as React from 'react';
import { useEffect, useState } from 'react';
import { ModeEnum } from '../enums/ModeEnum';
import DeleteWidget from './utils/DeleteWidget';

interface IProps {
  id: number;
  tabId: number;
  config: Record<string, unknown>;
  header: React.ReactElement;
  body: React.ReactElement;
  editModeComponent: React.ReactElement<IProps>;
  refreshFunction: () => void;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function Widget(props: IProps): React.ReactElement {
  const [mode, setMode] = useState(ModeEnum.READ);

  useEffect(() => {
    setMode(ModeEnum.READ);
  }, [props.config]);

  function editWidget() {
    setMode(ModeEnum.EDIT);
  }

  function cancelDeletion() {
    setMode(ModeEnum.READ);
  }

  function deleteWidget() {
    setMode(ModeEnum.DELETE);
  }

  return (
    <div>
      {mode === ModeEnum.READ ? (
        <div>
          <div className="header">
            <div className="leftGroup widgetHeader">{props.header}</div>
            <div className="rightGroup">
              <button
                onClick={editWidget}
                className="btn btn-default editButton"
              >
                <i className="fa fa-cog" aria-hidden="true" />
              </button>
              <button
                onClick={props.refreshFunction}
                className="btn btn-default refreshButton"
              >
                <i className="fa fa-refresh" aria-hidden="true" />
              </button>
              <button
                onClick={deleteWidget}
                className="btn btn-default deleteButton"
              >
                <i className="fa fa-trash" aria-hidden="true" />
              </button>
            </div>
          </div>
          {props.body}
        </div>
      ) : mode === ModeEnum.DELETE ? (
        <DeleteWidget
          idWidget={props.id}
          onDeleteButtonClicked={props.onDeleteButtonClicked}
          onCancelButtonClicked={cancelDeletion}
        />
      ) : (
        props.editModeComponent
      )}
    </div>
  );
}
