import * as React from 'react';
import { useState } from 'react';
import { Button, NavItem, NavLink } from 'reactstrap';
import { ITab } from '../../model/Tab';
import { deleteTab, updateTab } from '../../services/TabService';
interface IProps {
  tab: ITab;
  onTabClicked: () => void;
  onTabDeleted: (id: number) => void;
}

export default function NavDash(props: IProps): React.ReactElement {
  const [label, setLabel] = useState(props.tab.label);
  const [isToggled, toggle] = useState(false);

  function deleteTabFromDash() {
    deleteTab(props.tab.id).then(() => props.onTabDeleted(props.tab.id));
  }

  function saveTabName() {
    updateTab(props.tab.id, label, props.tab.tabOrder).then(() => {
      toggle(!isToggled);
    });
  }

  function clickToggle() {
    toggle(!isToggled);
  }

  return (
    <NavItem className="clickableItem" key={props.tab.id}>
      <NavLink onClick={props.onTabClicked}>
        {isToggled ? (
          <div className="flexRow">
            <input
              onDoubleClick={saveTabName}
              onChange={(event) => setLabel(event.target.value)}
              value={label}
            />
            <Button className="deleteTabButton" onClick={deleteTabFromDash}>
              <i className="fa fa-trash" />
            </Button>
          </div>
        ) : (
          <span onDoubleClick={clickToggle}>{label}</span>
        )}
      </NavLink>
    </NavItem>
  );
}
