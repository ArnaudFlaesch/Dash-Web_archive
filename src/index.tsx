import "bootstrap/dist/css/bootstrap.min.css";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Dash from './Dash';
import './index.css';
import registerServiceWorker from './registerServiceWorker';


ReactDOM.render(<Dash />, document.getElementById('root') as HTMLElement);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
registerServiceWorker();
