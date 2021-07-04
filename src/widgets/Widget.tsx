import { ReactElement, useEffect, useState } from 'react';
import { useCustomEventListener } from 'react-custom-events';
import { ModeEnum } from '../enums/ModeEnum';
import DeleteWidget from './utils/DeleteWidget';

interface IProps {
  id: number;
  tabId: number;
  config: Record<string, unknown>;
  header: ReactElement;
  body: ReactElement;
  additionalActionButtons?: ReactElement;
  editModeComponent?: ReactElement<IProps>;
  refreshFunction: () => void;
  onDeleteButtonClicked: (idWidget: number) => void;
}

export default function Widget(props: IProps): ReactElement {
  const [mode, setMode] = useState(ModeEnum.READ);

  useCustomEventListener('refreshAllWidgets', () => {
    props.refreshFunction();
  });

  useEffect(() => {
    setMode(ModeEnum.READ);
  }, [props.config]);

  function editWidget() {
    if (props.editModeComponent) {
      setMode(ModeEnum.EDIT);
    }
  }

  function cancelDeletion() {
    setMode(ModeEnum.READ);
  }

  function deleteWidget() {
    setMode(ModeEnum.DELETE);
  }

  return (
    <div>
      {mode === ModeEnum.READ && (
        <div>
          <div className="header">
            <div className="leftGroup widgetHeader">{props.header}</div>
            <div className="rightGroup">
              {props.additionalActionButtons}
              {props.editModeComponent && (
                <button
                  onClick={editWidget}
                  className="btn btn-default editButton"
                >
                  <i className="fa fa-cog" aria-hidden="true" />
                </button>
              )}
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
      )}
      {mode === ModeEnum.DELETE && (
        <DeleteWidget
          idWidget={props.id}
          onDeleteButtonClicked={props.onDeleteButtonClicked}
          onCancelButtonClicked={cancelDeletion}
        />
      )}
      {mode === ModeEnum.EDIT &&
        props.editModeComponent !== null &&
        props.editModeComponent}
    </div>
  );
}
