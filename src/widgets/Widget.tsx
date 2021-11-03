import { ReactElement, useEffect, useState } from 'react';
import { useCustomEventListener } from 'react-custom-events';
import { ModeEnum } from '../enums/ModeEnum';
import DeleteWidget from './utils/DeleteWidget';
import SettingsIcon from '@mui/icons-material/Settings';
import { IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import DeleteIcon from '@mui/icons-material/Delete';
import './Widget.scss';

interface IProps {
  id: number;
  tabId: number;
  config: Map<string, unknown>;
  header: ReactElement;
  body: ReactElement;
  additionalActionButtons?: ReactElement;
  editModeComponent?: ReactElement;
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

  function isEmptyWidget(): boolean {
    const configValues = [];
    const iterator = props.config.values();
    let entry = iterator.next();
    while (!entry.done) {
      configValues.push(entry.value);
      entry = iterator.next();
    }
    return configValues.some((value) => !value);
  }

  return (
    <div className="widget h-96 m-2 border-2 border-solid border-black">
      {mode === ModeEnum.DELETE && (
        <DeleteWidget
          idWidget={props.id}
          onDeleteButtonClicked={props.onDeleteButtonClicked}
          onCancelButtonClicked={cancelDeletion}
        />
      )}

      {(mode === ModeEnum.EDIT || (isEmptyWidget() && mode !== ModeEnum.DELETE)) && props.editModeComponent !== null && (
        <div className="flex flex-col">
          <div className="grid justify-items-end m-2">
            <IconButton onClick={deleteWidget} className="deleteButton">
              <DeleteIcon />
            </IconButton>
          </div>
          <div>{props.editModeComponent}</div>
        </div>
      )}

      {mode === ModeEnum.READ && !isEmptyWidget() && (
        <div>
          <div className="header h-10 flex flex-row justify-between sticky top-0">
            <div className="font-bold w-1/2">{props.header}</div>
            <div className="flex flex-row max-w-1/2">
              {props.additionalActionButtons}
              {props.editModeComponent && (
                <IconButton onClick={editWidget} className="editButton">
                  <SettingsIcon />
                </IconButton>
              )}
              <IconButton onClick={props.refreshFunction} className="refreshButton">
                <RefreshIcon />
              </IconButton>
              <IconButton onClick={deleteWidget} className="deleteButton">
                <DeleteIcon />
              </IconButton>
            </div>
          </div>
          <div className="max-h-80 overflow-y-scroll">{props.body}</div>
        </div>
      )}
    </div>
  );
}
