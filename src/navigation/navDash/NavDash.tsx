import { ReactElement, useState } from 'react';
import logger from 'src/utils/LogUtils';
import { ITab } from '../../model/Tab';
import { deleteTab, updateTab } from '../../services/tab.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Input, Tab } from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import { useSelector } from 'react-redux';
import { IReducerState } from 'src/reducers/rootReducer';

interface IProps {
  tab: ITab;
  onTabClicked: () => void;
  onTabDeleted: (id: number) => void;
}

export default function NavDash(props: IProps): ReactElement {
  const [label, setLabel] = useState(props.tab.label);
  const [isToggled, toggle] = useState(false);
  const activeTab = useSelector((state: IReducerState) => state.activeTab);

  function deleteTabFromDash() {
    deleteTab(props.tab.id)
      .then(() => props.onTabDeleted(props.tab.id))
      .catch((error) => logger.error(error.message));
  }

  function saveTabName() {
    updateTab(props.tab.id, label, props.tab.tabOrder)
      .then(() => toggle(!isToggled))
      .catch((error) => logger.error(error.message));
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
