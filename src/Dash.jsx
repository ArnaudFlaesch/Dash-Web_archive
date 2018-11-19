import React, { Component } from 'react';
import { Dashboard } from "./components/Dashboard";
import './Dash.css';

class Dash extends Component {

	render() {
		return (
			<div className="Dash" >
				<Dashboard />
			</div>
		);
	}
}

export default Dash;