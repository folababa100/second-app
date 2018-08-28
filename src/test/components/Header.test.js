import React from 'react';
import { shallow } from "enzyme";
import Header from '../../components/Header';

test('renders without crashing', () => {

  const wrapper = shallow(<Header/>);
  expect(wrapper).toMatchSnapshot();
});
