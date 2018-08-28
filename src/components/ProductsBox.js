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
    axios.get('http://localhost:3002/products', {
      headers: {
        "x-auth": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1Yjg1NjZjOTA1MmI0MDJjODBmZjJjYWYiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTM1NDY5MjU4fQ.9qEVqieslHkc-ZeLGW5Nv-Q3pSsat7NobFJAvW-T23g"
      }
    })
      .then(res => {
        this.setState({ data: res.data.products })
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
