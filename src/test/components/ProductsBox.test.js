import React from 'react';
import { shallow } from 'enzyme';
import ProductsBox from '../../components/ProductsBox';

test('should render component correctly', () => {
  const wrapper = shallow(<ProductsBox/>);
  expect(wrapper).toMatchSnapshot();
})
