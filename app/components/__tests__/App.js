import React from 'react';
import { shallow } from 'enzyme';
import App from '../App';

//Unfortunately wrapping the connect HOF from redux returns an object and breaks the shallow rendering
describe('App', () => {
  it('should render a <div />', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('div').length).toEqual(1);
  });
});
