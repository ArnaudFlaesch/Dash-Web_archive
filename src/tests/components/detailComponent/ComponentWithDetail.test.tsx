import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ComponentWithDetail from '../../../components/detailComponent/ComponentWithDetail';

describe('ComponentWithDetail tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    const props = { componentRoot: "Titre", componentDetail: "Detail" };
    ReactDOM.render(<ComponentWithDetail {...props} />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});

