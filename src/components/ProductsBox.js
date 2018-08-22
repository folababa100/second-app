import React from 'react';
import axios from 'axios';
import Products from './Products';
import Header from './Header';

export default class PostsBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    }
    this.loadProductsFromServer = this.loadProductsFromServer.bind(this);
  }
  loadProductsFromServer() {
    axios.get('http://localhost:3001/products')
      .then(res => {
        this.setState({data: res.data.products})
      })
  }
  componentDidMount() {
    this.loadProductsFromServer()
  }
  render() {
    return (
      <div>
        <Header/>
        <h1>Hello</h1>
        <Products data={this.state.data}/>
      </div>
    )
  }
}
