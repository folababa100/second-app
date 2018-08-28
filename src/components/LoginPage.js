import React, { Component } from 'react';
import { connect } from "react-redux";
import * as actions from '../actions/auth';
import axios from 'axios';

class LoginPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      error: ''
    }
  }
  loginUp(e) {
    e.preventDefault()

    const email = this.refs.email.value.trim();
    const password = this.refs.password.value.trim();

    axios.post('http://localhost:3002/users/login', {
      email,
      password
    })
      .then((res) => {
        console.log(res)
      }).catch((err) => {
        console.log(err)
      })
  }
  render() {
    return (
      <form onSubmit={this.loginUp.bind(this)}>
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <input ref="email" className="form-control" placeholder="Enter your email" type="email" />
              </div>
              <div className="form-group">
                <input ref="password" className="form-control" placeholder="Enter your password" type="password" />
              </div>
              <button className="btn btn-primary">Login</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default connect(null, actions)(LoginPage);
