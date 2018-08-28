import React, { Component } from 'react';
import axios from 'axios';

class SignupPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: ''
    }
  }
  signUp(e) {
    e.preventDefault()

    const username = this.refs.username.value.trim();
    const email = this.refs.email.value.trim();
    const password = this.refs.password.value.trim();
    axios.post('http://localhost:3002/users', {
      username,
      email,
      password
    })
      .then(res => {
        console.log(res)
      }).catch(err => {
        console.log(err)
      })
  }
  render() {
    return (
      <form onSubmit={this.signUp.bind(this)} noValidate>
        <div className="container">
          <div className="card">
            <div className="card-body">
              <div className="form-group">
                <input ref="email" className="form-control" placeholder="Enter your email" type="email" />
              </div>
              <div className="form-group">
                <input ref="username" className="form-control" placeholder="Enter your username" type="text" />
              </div>
              <div className="form-group">
                <input ref="password" className="form-control" placeholder="Enter your password" type="password" />
              </div>
              <button className="btn btn-primary">SignUp</button>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

export default SignupPage;
