const listsReducerDefaultState = [];

export default (state = listsReducerDefaultState, action) => {
  switch (action.type) {
    case "ADD_LISTS":
      return [
        ...state,
        action.list
      ]
    case "REMOVE_LISTS":
      return state.filter(({id}) => id !== action.id)
    case "UPDATE_LISTS":
      return state.map(list => {
        if (list.id === action.id) {
          return [
            ...state,
            ...action.updates
          ]
        } else {
          return list
        }
      })
  
    default:
      return state
  }
}
