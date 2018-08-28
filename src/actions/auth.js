import axios from 'axios';
import { LOGIN_USER } from "./types";

export const startSignup = () => {
  return (dispatch) => {
    axios.get('http://localhost:3001/users/me').then(res => dispatch({ type: LOGIN_USER, payload: res }))
  }
}

// export const signup = () => ({
//   type: 'SIGNUP'
// })

// export const login = (uid) => ({
//   type: 'LOGIN',
//   uid
// })
