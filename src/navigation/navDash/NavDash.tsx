import * as React from 'react';
import { useState } from 'react';
import { NavItem, NavLink } from 'reactstrap';
import { updateTab } from '../../services/TabService';

interface IProps {
    id: number;
    label: string;
    onTabClicked: () => void;
}

export default function NavDash(props: IProps) {
    const [label, setLabel] = useState(props.label);
    const [isToggled, toggle] = useState(false);

    const saveTabName = (newLabel: string) => {
        updateTab(props.id, newLabel)
            .then(response => {
                toggle(!isToggled);
            });
    }

    return (
        <NavItem className="clickable-item" key={props.id}>
            <NavLink onClick={props.onTabClicked}>
                {isToggled
                    ? <input onDoubleClick={() => saveTabName(label)} onChange={(event) => setLabel(event.target.value)} value={label} />
                    : <span onDoubleClick={() => toggle(!isToggled)}>{label}</span>
                }
            </NavLink>
        </NavItem>
    )
}