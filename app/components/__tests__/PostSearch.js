import React from 'react';
import { shallow } from 'enzyme';
import { PostSearch } from '../PostSearch';

describe('PostSearch', () => {
  var wrapper;
  const mockHandleSubmit = jest.fn();

  beforeEach(() => {
    wrapper = shallow(
      <PostSearch
        text={''}
        history={{}}
        dispatch={() => {}}
        handleSearch={mockHandleSubmit}
      />
    );
  });

  it('should update <input /> value', () => {
    wrapper.setProps({ text: 'search_tag' });
    expect(wrapper.find('.search-field').props().value).toEqual('search_tag');
  });

  it('should call handleSearch on <form /> submit', () => {
    wrapper.simulate('submit');
    expect(mockHandleSubmit.mock.calls.length).toEqual(1);
  });
});
