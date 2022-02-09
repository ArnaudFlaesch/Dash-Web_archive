import { ReactElement, useState } from 'react';
import logger from 'src/utils/LogUtils';
import { ITab } from '../../model/Tab';
import { deleteTab, updateTab } from '../../services/tab.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Input, Tab } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useDispatch, useSelector } from 'react-redux';
import { IReducerState } from 'src/reducers/rootReducer';
import { AxiosError } from 'axios';
import { handleError } from 'src/reducers/actions';

interface IProps {
  tab: ITab;
  onTabClicked: () => void;
  onTabDeleted: (id: number) => void;
}

export default function NavDash(props: IProps): ReactElement {
  const [label, setLabel] = useState(props.tab.label);
  const [isToggled, toggle] = useState(false);
  const activeTab = useSelector((state: IReducerState) => state.activeTab);
  const dispatch = useDispatch();

  const ERROR_MESSAGE_UPDATE_TAB = "Erreur lors de la modification d'un onglet.";
  const ERROR_MESSAGE_DELETE_TAB = "Erreur lors de la suppression d'un onglet.";

  function deleteTabFromDash() {
    deleteTab(props.tab.id)
      .then(() => props.onTabDeleted(props.tab.id))
      .catch((error: AxiosError) => dispatch(handleError(error, ERROR_MESSAGE_DELETE_TAB)));
  }

  function saveTabName() {
    updateTab(props.tab.id, label, props.tab.tabOrder)
      .catch((error: AxiosError) => dispatch(handleError(error, ERROR_MESSAGE_UPDATE_TAB)))
      .finally(() => toggle(!isToggled));
  }

  function clickToggle() {
    toggle(!isToggled);
  }

  function enterSaveTabName(event: React.KeyboardEvent): void {
    if (event.key === 'Enter') {
      saveTabName();
    }
  }

  return (
    <div
      onClick={props.onTabClicked}
      className={`tab ${props.tab.id === activeTab ? 'selectedItem' : ''} border-2 border-gray-800 border-opacity-100`}
    >
      {isToggled ? (
        <div className="flex flex-row">
          <Input
            onDoubleClick={saveTabName}
            onKeyPress={enterSaveTabName}
            onChange={(event) => setLabel(event.target.value)}
            value={label}
          />
          <IconButton className="deleteTabButton" color="primary" onClick={deleteTabFromDash}>
            <DeleteIcon />
          </IconButton>
        </div>
      ) : (
        <div className="flex flex-row">
          <div>
            <Tab onDoubleClick={clickToggle} value={props.tab.id.toString()} label={label} wrapped />
          </div>
          <div>
            <DragHandleIcon />
          </div>
        </div>
      )}
    </div>
  );
}
