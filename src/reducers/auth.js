export default (state = {}, action) => {
  console.log(action)
  switch (action.type) {
    case 'LOGIN':
      return {};
    default:
      return state;
  }
}