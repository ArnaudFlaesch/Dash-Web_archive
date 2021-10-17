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
  config: Record<string, unknown>;
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

  return (
    <div className="widget h-96 m-2 border-2 border-solid border-black">
      {mode === ModeEnum.READ && (
        <div>
          <div className="header flex flex-row justify-between">
            <div className="font-bold">{props.header}</div>
            <div className="flex flex-row">
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
      {mode === ModeEnum.EDIT && props.editModeComponent !== null && props.editModeComponent}
    </div>
  );
}
