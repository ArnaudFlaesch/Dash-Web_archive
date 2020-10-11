import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Store from "../../../pages/store/Store";

describe('Store tests', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        const onWidgetAdded = () => null;
        ReactDOM.render(<Store onWidgetAdded={ onWidgetAdded } />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
