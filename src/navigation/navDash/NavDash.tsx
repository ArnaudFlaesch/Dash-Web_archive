import { ReactElement, useState } from 'react';
import logger from 'src/utils/LogUtils';
import { ITab } from '../../model/Tab';
import { deleteTab, updateTab } from '../../services/tab.service';
import DeleteIcon from '@mui/icons-material/Delete';
import { IconButton, Input, Tab } from '@mui/material';
interface IProps {
  tab: ITab;
  onTabClicked: () => void;
  onTabDeleted: (id: number) => void;
}

export default function NavDash(props: IProps): ReactElement {
  const [label, setLabel] = useState(props.tab.label);
  const [isToggled, toggle] = useState(false);

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
    <div onClick={props.onTabClicked}>
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
        <Tab key={props.tab.id} onDoubleClick={clickToggle} label={label} />
      )}
    </div>
  );
}
