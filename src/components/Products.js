import React, { Component } from 'react';

class Products extends Component {
  render() {
    let productData = this.props.data.map(product => {
      return (
        <div key={product._id}>
          <p>{product.name}</p>
          <p>{product.body}</p>
        </div>
      )
    })
    return (
      <div>
        {productData}
      </div>
    )
  }
}

export default Products;
