import React from 'react';
import ReactDOM from 'react-dom';
import Products from '../../components/Products';

test('should correctly render component', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Products/>, div);
  ReactDOM.unmountComponentAtNode(div);
})
