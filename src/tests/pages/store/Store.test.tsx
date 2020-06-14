import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Store from "../../../pages/store/Store";

describe('Store tests', () => {
    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(<Store onWidgetAdded={() => null} />, div);
        ReactDOM.unmountComponentAtNode(div);
    });
});
