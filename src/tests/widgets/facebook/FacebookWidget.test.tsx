import * as ReactDOM from 'react-dom';
import FacebookWidget from '../../../widgets/facebook/FacebookWidget';

describe('Facebook widget tests', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<FacebookWidget />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
