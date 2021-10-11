import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';
import TwitterTimelineWidget from 'src/widgets/twitter/TwitterTimelineWidget';

Enzyme.configure({ adapter: new Adapter() });

describe('Twitter component tests', () => {
  let container: HTMLElementTagNameMap['div'];
  beforeEach(() => {
    // setup a DOM element as a render target
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(container);
    container.remove();
  });

  it('Should display the name of the user in the header', () => {
    const profile = 'nodejs';
    act(() => {
      const onDeleteButtonClicked = () => null;
      render(
        <TwitterTimelineWidget id={1} profile={profile} tabId={2} onDeleteButtonClicked={onDeleteButtonClicked} />,
        container
      );
    });
    expect(container.querySelector('.timelineHeader')?.textContent).toEqual(`Timeline de ${profile}`);
  });
});
