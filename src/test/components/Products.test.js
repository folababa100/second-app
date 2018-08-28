import React from 'react';
import {shallow} from 'enzyme';
import Products from '../../components/Products';

test('should correctly render component', () => {
  const wrapper = shallow(<Products/>);
  expect(wrapper).toMatchSnapshot()
})
