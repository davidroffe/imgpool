import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import App from '../App';

const mockStore = configureStore();
const initialState = {};
const store = mockStore(initialState);

describe('App', () => {
  it('should render a <div />', () => {
    const wrapper = shallow(<App.type store={store} />)
      .dive()
      .dive();
    expect(wrapper.find('BrowserRouter').length).toEqual(1);
  });
});
