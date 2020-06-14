import Navbar  from "../../navbar/Navbar";
import * as ReactDOM from 'react-dom';
import * as React from 'react';

describe("Navbar tests", () => {
    it('renders without crashing', () => {
      const div = document.createElement('div');
      ReactDOM.render(<Navbar navItems={[]} />, div);
      ReactDOM.unmountComponentAtNode(div);
    });
  });
  