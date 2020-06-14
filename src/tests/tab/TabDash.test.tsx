import TabDash from "../../tab/TabDash";
import * as ReactDOM from 'react-dom';
import * as React from 'react';

describe("TabDash tests", () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<TabDash />, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });
  