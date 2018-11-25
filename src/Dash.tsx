import * as React from 'react';
import { Dashboard } from "./components/Dashboard";
import './Dash.css';

class Dash extends React.Component {

	public render() {
		return (
			<div className="Dash" >
				<Dashboard />
			</div>
		);
	}
}

export default Dash;