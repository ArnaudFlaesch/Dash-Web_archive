import * as Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TwitterTimelineWidget from 'src/widgets/twitter/TwitterTimelineWidget';

Enzyme.configure({ adapter: new Adapter() });

describe('Twitter component tests', () => {
  it('CheckboxWithLabel changes the text after click', () => {
    const component = Enzyme.shallow(
      <TwitterTimelineWidget id={1} profile="nodejs" tabId={2} onDeleteButtonClicked={() => {}} />
    );
    expect(component.find('.timelineHeader').text()).toEqual('Timeline de nodejs');
  });
});
